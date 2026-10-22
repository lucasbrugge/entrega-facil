import { initialData } from './seed.js';
import { migrateDeliveryNumbers, reserveDeliveryNumber } from './delivery-numbers.js';

export const STORAGE_KEY = 'entrega-facil-demo-data-v1';
const clone = (value) => structuredClone(value);
const sameId = (left, right) => String(left) === String(right);

function write(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    throw new Error(
      'Não foi possível persistir os dados locais. Libere o armazenamento e tente novamente.',
      {
        cause: error,
      },
    );
  }
}

function read() {
  let saved;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    throw new Error('Não foi possível acessar os dados locais deste navegador.', { cause: error });
  }
  let data;
  try {
    data = saved === null ? clone(initialData) : JSON.parse(saved);
  } catch (error) {
    throw new Error('Os dados locais não puderam ser lidos. O conteúdo original foi preservado.', {
      cause: error,
    });
  }
  if (!Array.isArray(data?.entregas) || !Array.isArray(data?.enderecos))
    throw new Error('Os dados locais têm formato inválido. O conteúdo original foi preservado.');
  const previous = JSON.stringify(data);
  migrateDeliveryNumbers(data);
  if (saved === null || JSON.stringify(data) !== previous) write(data);
  return data;
}

function find(data, id) {
  const delivery = data.entregas.find((item) => sameId(item.id, id));
  if (!delivery) throw new Error('A entrega não foi encontrada nos dados locais.');
  return delivery;
}

// Cada alteração é gravada em uma única chave, com entrega e endereços juntos.
export const demoStore = {
  list() {
    return clone(read());
  },
  details(id) {
    const data = read();
    return {
      delivery: clone(find(data, id)),
      addresses: clone(data.enderecos.filter((item) => sameId(item.entregaId, id))),
    };
  },
  create(delivery, addresses) {
    const data = read();
    const saved = {
      ...delivery,
      id: crypto.randomUUID(),
      numeroEntrega: reserveDeliveryNumber(data),
    };
    data.entregas.push(saved);
    data.enderecos.push(
      ...addresses.map((address) => ({ ...address, id: crypto.randomUUID(), entregaId: saved.id })),
    );
    write(data);
    return clone(saved);
  },
  updateStatus(id, status) {
    const data = read();
    const delivery = find(data, id);
    delivery.status = status;
    write(data);
    return clone(delivery);
  },
  delete(id) {
    const data = read();
    find(data, id);
    data.entregas = data.entregas.filter((item) => !sameId(item.id, id));
    data.enderecos = data.enderecos.filter((item) => !sameId(item.entregaId, id));
    write(data);
  },
};
