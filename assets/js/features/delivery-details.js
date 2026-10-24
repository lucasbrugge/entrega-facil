import { formatDeliveryNumber, localDate, statusClass } from '../utils/formatters.js';
import { initDeliveryStatus } from './delivery-status.js';
import { initDeliveryDelete } from './delivery-delete.js';

const byId = (id) => document.getElementById(id);

function fillAddress(prefix, address = {}) {
  byId(`${prefix}-address-title`).textContent =
    [address.logradouro, address.numero].filter(Boolean).join(', ') || 'Endereço não informado';
  byId(`${prefix}-address-line`).textContent =
    [address.bairro, address.cidade || address.localidade, address.uf].filter(Boolean).join(', ') ||
    '—';
  byId(`${prefix}-cep`).textContent = `CEP: ${address.cep || '—'}`;
}

function displayStatus(status) {
  for (const id of ['detail-status', 'detail-status-secondary', 'modal-current-status']) {
    const badge = byId(id);
    badge.className = statusClass(status);
    badge.textContent = status || 'Sem status';
  }
}

export async function initDeliveryDetails(service) {
  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) throw new Error('O identificador da entrega não foi informado.');
  const { delivery, addresses } = await service.details(id);
  if (!delivery) throw new Error('A entrega não foi encontrada neste modo de persistência.');

  byId('detail-title').textContent = `Entrega #${formatDeliveryNumber(delivery)}`;
  fillAddress(
    'origin',
    addresses.find((address) => address.tipo?.toLowerCase() === 'origem'),
  );
  fillAddress(
    'destination',
    addresses.find((address) => address.tipo?.toLowerCase() === 'destino'),
  );
  for (const [suffix, field] of Object.entries({
    client: 'clienteNome',
    cpf: 'clienteCpf',
    phone: 'clienteTelefone',
    product: 'produtoNome',
    description: 'produtoDescricao',
  })) {
    byId(`detail-${suffix}`).textContent = delivery[field] || '—';
  }
  byId('detail-date').textContent = localDate(delivery.dataPrevista);
  byId('modal-delivery-id').textContent = byId('detail-title').textContent;
  byId('delete-delivery-number').textContent = byId('detail-title').textContent;
  byId('new-status').value = delivery.status;
  displayStatus(delivery.status);

  const state = {
    delivery,
    busy: false,
    setBusy(active) {
      state.busy = active;
      for (const action of document.querySelectorAll('[data-delivery-action]'))
        action.disabled = active;
    },
    update(updated) {
      state.delivery = updated;
      displayStatus(updated.status);
    },
  };
  initDeliveryStatus(service, state);
  initDeliveryDelete(service, state);
  state.setBusy(false);
}
