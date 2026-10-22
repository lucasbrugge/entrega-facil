import { createApi, isApiUnavailable } from './api.js';
import { createRecovery } from './api-recovery.js';
import { demoStore } from '../data/demo-store.js';
import { migrateDeliveryNumbers, reserveDeliveryNumber } from '../data/delivery-numbers.js';
import { statuses } from '../utils/validation.js';

const deliveryPath = (id) => `/entregas/${encodeURIComponent(id)}`;

function validateStatus(status) {
  if (!statuses.includes(status)) throw new Error('Selecione um status permitido.');
}

async function probe(api) {
  const [entregas, enderecos] = await Promise.all([
    api.request('/entregas'),
    api.request('/enderecos'),
  ]);
  if (!Array.isArray(entregas) || !Array.isArray(enderecos))
    throw new Error('As coleções da API têm formato inválido.');
  return { entregas, enderecos };
}

function apiService(api, recovery) {
  let busy = false;

  async function prepare() {
    await recovery.recover();
    const entregas = await api.request('/entregas');
    const config = await api.request('/configuracao');
    if (
      !config ||
      !Number.isSafeInteger(config.ultimoNumeroEntrega) ||
      config.ultimoNumeroEntrega < 0
    )
      throw new Error('A API precisa da configuração de numeração presente no db.json do projeto.');
    const data = { entregas, ultimoNumeroEntrega: config.ultimoNumeroEntrega };
    const changed = migrateDeliveryNumbers(data);
    // Primeiro preserve a sequência, depois migre os registros antigos sem mudar os IDs.
    if (data.ultimoNumeroEntrega !== config.ultimoNumeroEntrega)
      await api.request('/configuracao', {
        method: 'PATCH',
        body: JSON.stringify({ ultimoNumeroEntrega: data.ultimoNumeroEntrega }),
      });
    for (const delivery of changed)
      await api.request(deliveryPath(delivery.id), {
        method: 'PATCH',
        body: JSON.stringify({ numeroEntrega: delivery.numeroEntrega }),
      });
    return data;
  }

  async function mutate(action) {
    if (busy) throw new Error('Aguarde a operação atual terminar.');
    busy = true;
    try {
      const data = await prepare();
      return await action(data);
    } finally {
      busy = false;
    }
  }

  async function details(id) {
    const delivery = await api.request(deliveryPath(id));
    const addresses = await api.request(`/enderecos?entregaId=${encodeURIComponent(id)}`);
    return { delivery, addresses };
  }

  async function create(delivery, addresses, data) {
    const numeroEntrega = reserveDeliveryNumber(data);
    await api.request('/configuracao', {
      method: 'PATCH',
      body: JSON.stringify({ ultimoNumeroEntrega: numeroEntrega }),
    });
    const saved = { ...delivery, id: crypto.randomUUID(), numeroEntrega };
    const operation = {
      type: 'creation',
      delivery: saved,
      addresses: addresses.map((address) => ({
        ...address,
        id: crypto.randomUUID(),
        entregaId: saved.id,
      })),
    };
    recovery.save(operation);
    try {
      await api.request('/entregas', { method: 'POST', body: JSON.stringify(saved) });
      for (const address of operation.addresses)
        await api.request('/enderecos', { method: 'POST', body: JSON.stringify(address) });
    } catch (cause) {
      try {
        await recovery.undoCreation(operation);
      } catch (cleanupError) {
        throw recovery.pendingError(operation, cleanupError);
      }
      throw new Error(
        `O cadastro incompleto foi desfeito. Você pode tentar novamente. ${cause.message}`,
        {
          cause,
        },
      );
    }
    recovery.clear();
    return saved;
  }

  async function deleteDelivery(id) {
    const delivery = await api.readOptional(deliveryPath(id));
    const addresses = await api.request(`/enderecos?entregaId=${encodeURIComponent(id)}`);
    // Uma tentativa anterior pode ter concluído a exclusão e perdido a confirmação.
    if (delivery === null) {
      if (addresses.length === 0) return;
      throw new Error(
        'A entrega não existe, mas ainda possui endereços. Confira os registros na API.',
      );
    }
    const operation = { type: 'deletion', phase: 'removing', delivery, addresses };
    recovery.save(operation);
    try {
      for (const address of operation.addresses) await recovery.remove('enderecos', address.id);
      await recovery.remove('entregas', id);
      if (!(await recovery.isDeleted(operation)))
        throw new Error('A API ainda possui registros relacionados à entrega.');
      recovery.clear();
    } catch (cause) {
      try {
        // Se só a resposta se perdeu e a remoção foi completa, não recrie dados.
        if (await recovery.isDeleted(operation)) {
          recovery.clear();
          return;
        }
        await recovery.restoreDeletion(operation);
      } catch (recoveryError) {
        throw recovery.pendingError(operation, recoveryError);
      }
      throw new Error(
        `A exclusão não foi concluída. Os dados originais foram restaurados. Você pode tentar novamente. ${cause.message}`,
        { cause },
      );
    }
  }

  return {
    mode: 'api',
    async list() {
      const data = await prepare();
      return { entregas: data.entregas, enderecos: await api.request('/enderecos') };
    },
    async details(id) {
      await prepare();
      return details(id);
    },
    create(delivery, addresses) {
      validateStatus(delivery.status);
      return mutate((data) => create(delivery, addresses, data));
    },
    updateStatus(id, status) {
      validateStatus(status);
      return mutate(async () => {
        try {
          return await api.request(deliveryPath(id), {
            method: 'PATCH',
            body: JSON.stringify({ status }),
          });
        } catch (cause) {
          // Consulte a API para reconhecer PATCH executado que perdeu a resposta.
          try {
            const actual = await api.request(deliveryPath(id));
            if (actual.status === status) return actual;
          } catch {
            // A interface mantém o modo API e informa a resposta incerta.
          }
          throw new Error(
            `Não foi possível confirmar a atualização. Recarregue para conferir o status antes de tentar novamente. ${cause.message}`,
            { cause },
          );
        }
      });
    },
    delete(id) {
      return mutate(() => deleteDelivery(id));
    },
  };
}

export async function createDeliveryService() {
  const api = createApi(window.ENTREGA_FACIL_API_URL || 'http://localhost:3000');
  const recovery = createRecovery(api);
  const requestedMode = new URLSearchParams(window.location.search).get('modo');
  let mode = requestedMode === 'demo' ? 'demo' : 'api';
  if (!['api', 'demo'].includes(requestedMode)) {
    // Uma recuperação pendente não pode ser escondida por um fallback local.
    const pending = recovery.read();
    try {
      await probe(api);
    } catch (error) {
      if (pending || !isApiUnavailable(error)) throw error;
      mode = 'demo';
    }
  }
  if (mode === 'api') return apiService(api, recovery);
  // Inicializa somente quando não há estado, incluindo um estado vazio após exclusões.
  demoStore.list();
  return {
    mode: 'demo',
    list: async () => demoStore.list(),
    details: async (id) => demoStore.details(id),
    create: async (delivery, addresses) => {
      validateStatus(delivery.status);
      return demoStore.create(delivery, addresses);
    },
    updateStatus: async (id, status) => {
      validateStatus(status);
      return demoStore.updateStatus(id, status);
    },
    delete: async (id) => demoStore.delete(id),
  };
}
