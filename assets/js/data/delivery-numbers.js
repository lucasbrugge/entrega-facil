const positiveInteger = (value) => Number.isSafeInteger(value) && value > 0;

// Migra apenas a apresentação. IDs e relacionamentos nunca são reescritos.
export function migrateDeliveryNumbers(data) {
  const used = new Set();
  for (const delivery of data.entregas) {
    if (positiveInteger(delivery.numeroEntrega)) {
      if (used.has(delivery.numeroEntrega))
        throw new Error(
          'Existem números de entrega repetidos. Confira os dados antes de continuar.',
        );
      used.add(delivery.numeroEntrega);
    }
  }
  const legacyNumber = (id) => {
    const match = String(id).match(/^(?:demo-)?(\d+)$/);
    const value = match ? Number(match[1]) : 0;
    return positiveInteger(value) ? value : 0;
  };
  let highest = Math.max(
    0,
    Number.isSafeInteger(data.ultimoNumeroEntrega) ? data.ultimoNumeroEntrega : 0,
    ...used,
    ...data.entregas.map((delivery) => legacyNumber(delivery.id)),
  );
  const changed = [];
  for (const delivery of data.entregas) {
    if (positiveInteger(delivery.numeroEntrega)) continue;
    const legacy = legacyNumber(delivery.id);
    delivery.numeroEntrega = legacy && !used.has(legacy) ? legacy : ++highest;
    if (!positiveInteger(delivery.numeroEntrega)) throw new Error('Limite de numeração atingido.');
    used.add(delivery.numeroEntrega);
    changed.push(delivery);
  }
  data.ultimoNumeroEntrega = highest;
  return changed;
}

export function reserveDeliveryNumber(data) {
  const next = data.ultimoNumeroEntrega + 1;
  if (!positiveInteger(next)) throw new Error('Limite de numeração atingido.');
  data.ultimoNumeroEntrega = next;
  return next;
}
