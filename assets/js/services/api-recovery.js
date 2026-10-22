const recordPath = (collection, id) => `/${collection}/${encodeURIComponent(id)}`;
const sameRecord = (actual, expected) =>
  Object.entries(expected).every(
    ([key, value]) => JSON.stringify(actual[key]) === JSON.stringify(value),
  );

export function createRecovery(api) {
  const key = `entrega-facil-operacao-api-v1:${encodeURIComponent(api.url)}`;

  function read() {
    const saved = localStorage.getItem(key);
    if (saved === null) return null;
    let operation;
    try {
      operation = JSON.parse(saved);
    } catch (cause) {
      throw new Error('O registro de recuperação está ilegível e foi preservado.', { cause });
    }
    if (
      !['creation', 'deletion'].includes(operation?.type) ||
      !operation.delivery?.id ||
      !Array.isArray(operation.addresses)
    )
      throw new Error('O registro de recuperação tem formato inválido e foi preservado.');
    return operation;
  }

  function save(operation) {
    try {
      localStorage.setItem(key, JSON.stringify(operation));
    } catch (cause) {
      throw new Error(
        'Libere o armazenamento do navegador para preservar a recuperação desta operação.',
        {
          cause,
        },
      );
    }
  }

  const clear = () => localStorage.removeItem(key);

  // Mesmo uma falha HTTP pode acontecer depois da gravação: consulte antes de repetir.
  async function remove(collection, id) {
    const path = recordPath(collection, id);
    if (!(await api.readOptional(path))) return;
    let failure;
    try {
      await api.request(path, { method: 'DELETE' });
    } catch (error) {
      failure = error;
    }
    if (!(await api.readOptional(path))) return;
    throw failure || new Error(`Não foi possível remover o registro ${id}.`);
  }

  async function restore(collection, snapshot) {
    const path = recordPath(collection, snapshot.id);
    let actual = await api.readOptional(path);
    if (!actual) {
      let failure;
      try {
        await api.request(`/${collection}`, { method: 'POST', body: JSON.stringify(snapshot) });
      } catch (error) {
        failure = error;
      }
      actual = await api.readOptional(path);
      if (!actual)
        throw failure || new Error(`Não foi possível restaurar o registro ${snapshot.id}.`);
    }
    if (!sameRecord(actual, snapshot))
      throw new Error(
        `O registro ${snapshot.id} foi alterado. Confira a API antes de continuar a recuperação.`,
      );
  }

  async function isDeleted(operation) {
    const delivery = await api.readOptional(recordPath('entregas', operation.delivery.id));
    const addresses = await api.request(
      `/enderecos?entregaId=${encodeURIComponent(operation.delivery.id)}`,
    );
    return delivery === null && addresses.length === 0;
  }

  async function undoCreation(operation) {
    for (const address of operation.addresses) await remove('enderecos', address.id);
    await remove('entregas', operation.delivery.id);
    if (!(await isDeleted(operation)))
      throw new Error('Ainda existem registros do cadastro incompleto.');
    clear();
  }

  async function restoreDeletion(operation) {
    save({ ...operation, phase: 'restoring' });
    // O pai deve existir antes dos endereços, inclusive na compensação.
    await restore('entregas', operation.delivery);
    for (const address of operation.addresses) await restore('enderecos', address);
    clear();
  }

  function pendingError(operation, cause) {
    const action =
      operation.type === 'creation' ? 'limpeza do cadastro' : 'recuperação da exclusão';
    return new Error(
      `A ${action} da entrega ${operation.delivery.id} está pendente. Restabeleça a API e tente novamente ou recarregue a página. O snapshot foi preservado neste navegador; outras alterações na API ficam bloqueadas até a recuperação. ${cause.message}`,
      { cause },
    );
  }

  async function recover() {
    const operation = read();
    if (!operation) return;
    try {
      if (operation.type === 'creation') await undoCreation(operation);
      else if (operation.phase !== 'restoring' && (await isDeleted(operation))) clear();
      else await restoreDeletion(operation);
    } catch (cause) {
      throw pendingError(operation, cause);
    }
  }

  return {
    read,
    save,
    clear,
    remove,
    isDeleted,
    undoCreation,
    restoreDeletion,
    pendingError,
    recover,
  };
}
