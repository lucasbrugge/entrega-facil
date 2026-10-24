import { addressCity, formatDeliveryNumber, localDate, statusBadge } from '../utils/formatters.js';
import { modeLink, showAlert } from '../utils/feedback.js';

const byId = (id) => document.getElementById(id);

function metaBlock(label, value) {
  const wrapper = document.createElement('div');
  const name = document.createElement('span');
  name.className = 'ef-meta d-block fw-medium text-secondary text-uppercase';
  name.textContent = label;
  const text = document.createElement('p');
  text.className = 'small mb-3 text-break';
  text.textContent = value || '—';
  wrapper.append(name, text);
  return wrapper;
}

function deliveryCard(delivery, mode) {
  const origin = delivery.addresses.find((address) => address.tipo?.toLowerCase() === 'origem');
  const destination = delivery.addresses.find(
    (address) => address.tipo?.toLowerCase() === 'destino',
  );
  const col = document.createElement('div');
  col.className = 'col';
  const article = document.createElement('article');
  article.className = 'card bg-white border-dark ef-card ef-delivery-card h-100';
  const header = document.createElement('div');
  header.className =
    'card-header bg-white d-flex flex-wrap justify-content-between align-items-center gap-2';
  const title = document.createElement('h2');
  title.className = 'h6 ef-heading mb-0';
  title.textContent = `Entrega #${formatDeliveryNumber(delivery)}`;
  header.append(title, statusBadge(delivery.status));
  const body = document.createElement('div');
  body.className = 'card-body';
  body.append(
    metaBlock('Produto', delivery.produtoNome),
    metaBlock('Cliente', delivery.clienteNome),
    metaBlock('Itinerário', `${addressCity(origin)} → ${addressCity(destination)}`),
  );
  const footer = document.createElement('div');
  footer.className =
    'card-footer d-flex flex-wrap justify-content-between align-items-center gap-2';
  const date = document.createElement('span');
  date.className = 'small text-secondary';
  date.textContent = `Previsão: ${localDate(delivery.dataPrevista)}`;
  const link = document.createElement('a');
  link.className = 'link-dark small fw-semibold text-nowrap';
  link.href = modeLink('pages/detalhes.html', mode, { id: delivery.id });
  link.textContent = 'Ver detalhes →';
  footer.append(date, link);
  article.append(header, body, footer);
  col.append(article);
  return col;
}

export async function initDeliveryList(service) {
  const list = byId('delivery-list');
  const { entregas, enderecos } = await service.list();
  const deliveries = entregas.map((delivery) => ({
    ...delivery,
    addresses: enderecos.filter((address) => String(address.entregaId) === String(delivery.id)),
  }));
  byId('delivery-count').textContent = deliveries.length;

  function render() {
    const query = byId('delivery-search').value.trim().toLocaleLowerCase('pt-BR');
    const filter = document.querySelector('[data-filter].active-filter')?.dataset.filter || 'todos';
    const items = deliveries.filter((delivery) => {
      const text =
        `${delivery.id} ${formatDeliveryNumber(delivery)} ${delivery.clienteNome} ${delivery.produtoNome}`.toLocaleLowerCase(
          'pt-BR',
        );
      return (!query || text.includes(query)) && (filter === 'todos' || delivery.status === filter);
    });
    list.replaceChildren(...items.map((delivery) => deliveryCard(delivery, service.mode)));
    byId('delivery-empty').classList.toggle('d-none', items.length > 0);
    list.setAttribute('aria-busy', 'false');
  }

  byId('delivery-search').addEventListener('input', render);
  const filters = document.querySelectorAll('[data-filter]');
  for (const button of filters) {
    button.addEventListener('click', () => {
      for (const item of filters) {
        const active = item === button;
        item.classList.toggle('active-filter', active);
        item.classList.toggle('btn-dark', active);
        item.classList.toggle('btn-outline-dark', !active);
        item.setAttribute('aria-pressed', String(active));
      }
      render();
    });
  }
  document.querySelector('[data-filter="todos"]').classList.add('active-filter');
  render();
  const removed = new URLSearchParams(window.location.search).get('excluida');
  if (removed) {
    showAlert(`Entrega #${removed} excluída com sucesso.`, 'success');
    const url = new URL(window.location.href);
    url.searchParams.delete('excluida');
    window.history.replaceState(null, '', url);
  }
}
