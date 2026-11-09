import { addressCity, formatDeliveryNumber, localDate, statusClass } from '../utils/formatters.js';
import { modeLink, showAlert } from '../utils/feedback.js';

const byId = (id) => document.getElementById(id);

function deliveryCard(delivery, mode) {
  const card = byId('delivery-card-template').content.cloneNode(true);
  const field = (name) => card.querySelector(`[data-field="${name}"]`);
  const origin = delivery.addresses.find((address) => address.tipo?.toLowerCase() === 'origem');
  const destination = delivery.addresses.find(
    (address) => address.tipo?.toLowerCase() === 'destino',
  );
  const values = {
    number: `Entrega #${formatDeliveryNumber(delivery)}`,
    product: delivery.produtoNome,
    client: delivery.clienteNome,
    route: `${addressCity(origin)} → ${addressCity(destination)}`,
    date: `Previsão: ${localDate(delivery.dataPrevista)}`,
    status: delivery.status || 'Sem status',
  };
  for (const [name, value] of Object.entries(values)) field(name).textContent = value || '—';
  field('status').className = statusClass(delivery.status);
  field('details').href = modeLink('pages/detalhes.html', mode, { id: delivery.id });
  return card;
}

export async function initDeliveryList(service) {
  const list = byId('delivery-list');
  const { entregas, enderecos } = await service.list();
  const deliveries = entregas.map((delivery) => ({
    ...delivery,
    addresses: enderecos.filter((address) => String(address.entregaId) === String(delivery.id)),
  }));
  byId('delivery-count').textContent = deliveries.length;
  let activeStatus = 'todos';

  function render() {
    const query = byId('delivery-search').value.trim().toLocaleLowerCase('pt-BR');
    const items = deliveries.filter((delivery) => {
      const text =
        `${delivery.id} ${formatDeliveryNumber(delivery)} ${delivery.clienteNome} ${delivery.produtoNome}`.toLocaleLowerCase(
          'pt-BR',
        );
      return (
        (!query || text.includes(query)) &&
        (activeStatus === 'todos' || delivery.status === activeStatus)
      );
    });
    list.replaceChildren(...items.map((delivery) => deliveryCard(delivery, service.mode)));
    byId('delivery-empty').classList.toggle('d-none', items.length > 0);
    list.setAttribute('aria-busy', 'false');
  }

  byId('delivery-search').addEventListener('input', render);
  const filters = document.querySelectorAll('[data-filter]');
  for (const button of filters) {
    button.addEventListener('click', () => {
      activeStatus = button.dataset.filter;
      for (const item of filters) {
        const active = item === button;
        item.classList.toggle('btn-dark', active);
        item.classList.toggle('btn-outline-dark', !active);
        item.setAttribute('aria-pressed', String(active));
      }
      render();
    });
  }
  render();
  const removed = new URLSearchParams(window.location.search).get('excluida');
  if (removed) {
    showAlert(`Entrega #${removed} excluída com sucesso.`, 'success');
    const url = new URL(window.location.href);
    url.searchParams.delete('excluida');
    window.history.replaceState(null, '', url);
  }
}
