(function () {
  'use strict';

  // Keep the documented JSON Server contract configurable for local environments.
  const API_URL = window.ENTREGA_FACIL_API_URL || 'http://localhost:3000';
  const STATUSES = ['Pendente', 'Em transporte', 'Entregue', 'Cancelada'];
  const all = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const byId = (id) => document.getElementById(id);

  async function api(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    });
    if (!response.ok) throw new Error(`A API respondeu com status ${response.status}.`);
    if (response.status === 204) return null;
    return response.json();
  }

  function showAlert(message, type = 'danger') {
    const box = byId('app-alert');
    if (!box) return;
    box.className = `alert alert-${type}`;
    box.textContent = message;
    box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function hideAlert() {
    const box = byId('app-alert');
    if (box) { box.className = 'alert d-none'; box.textContent = ''; }
  }

  function statusClass(status = '') {
    return `status-${status.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')}`;
  }

  function statusBadge(status) {
    const badge = document.createElement('span');
    badge.className = `ef-status ${statusClass(status)}`;
    badge.textContent = status || 'Sem status';
    return badge;
  }

  function localDate(value) {
    if (!value) return '—';
    const [year, month, day] = value.slice(0, 10).split('-');
    return year && month && day ? `${day}/${month}/${year}` : value;
  }

  function addressCity(address) {
    if (!address) return '—';
    return `${address.cidade || address.localidade || '—'}${address.uf ? ` - ${address.uf}` : ''}`;
  }

  async function loadDeliveries() {
    const list = byId('delivery-list');
    if (!list) return;
    try {
      const [deliveries, addresses] = await Promise.all([api('/entregas'), api('/enderecos')]);
      hideAlert();
      const merged = deliveries.map((delivery) => ({
        ...delivery,
        addresses: addresses.filter((address) => String(address.entregaId) === String(delivery.id)),
      }));
      window.entregaFacilItems = merged;
      byId('delivery-count').textContent = merged.length;
      renderDeliveries();
    } catch (error) {
      showAlert(`Não foi possível carregar as entregas. Verifique se o JSON Server está ativo em ${API_URL}. ${error.message}`);
      byId('delivery-empty').classList.remove('d-none');
    }
  }

  function renderDeliveries() {
    const list = byId('delivery-list');
    if (!list) return;
    const query = (byId('delivery-search').value || '').trim().toLocaleLowerCase('pt-BR');
    const filter = document.querySelector('[data-filter].active-filter')?.dataset.filter || 'todos';
    const items = (window.entregaFacilItems || []).filter((delivery) => {
      const text = `${delivery.id} ${delivery.clienteNome} ${delivery.produtoNome}`.toLocaleLowerCase('pt-BR');
      return (!query || text.includes(query)) && (filter === 'todos' || delivery.status === filter);
    });
    list.replaceChildren(...items.map((delivery) => {
      const origin = delivery.addresses.find((address) => address.tipo?.toLocaleLowerCase('pt-BR') === 'origem');
      const destination = delivery.addresses.find((address) => address.tipo?.toLocaleLowerCase('pt-BR') === 'destino');
      const col = document.createElement('div');
      col.className = 'col';
      const article = document.createElement('article');
      article.className = 'card ef-card ef-delivery-card';
      const header = document.createElement('div');
      header.className = 'card-header d-flex justify-content-between align-items-center gap-2';
      const title = document.createElement('h2');
      title.className = 'h6 ef-heading mb-0';
      title.textContent = `Entrega #${String(delivery.id).padStart(3, '0')}`;
      header.append(title, statusBadge(delivery.status));
      const body = document.createElement('div');
      body.className = 'card-body';
      body.append(
        metaBlock('Produto', delivery.produtoNome),
        metaBlock('Cliente', delivery.clienteNome),
        metaBlock('Itinerário', `${addressCity(origin)} → ${addressCity(destination)}`),
      );
      const footer = document.createElement('div');
      footer.className = 'card-footer ef-card-footer d-flex justify-content-between align-items-center gap-2';
      const date = document.createElement('span');
      date.className = 'small text-secondary';
      date.textContent = `Previsão: ${localDate(delivery.dataPrevista)}`;
      const link = document.createElement('a');
      link.className = 'link-dark small fw-semibold text-nowrap';
      link.href = `pages/detalhes.html?id=${encodeURIComponent(delivery.id)}`;
      link.textContent = 'Ver detalhes →';
      footer.append(date, link);
      article.append(header, body, footer);
      col.append(article);
      return col;
    }));
    byId('delivery-empty').classList.toggle('d-none', items.length > 0);
  }

  function metaBlock(label, value) {
    const wrapper = document.createElement('div');
    const name = document.createElement('span');
    name.className = 'ef-meta';
    name.textContent = label;
    const text = document.createElement('p');
    text.className = 'ef-meta-value';
    text.textContent = value || '—';
    wrapper.append(name, text);
    return wrapper;
  }

  function wireFilters() {
    if (!byId('delivery-list')) return;
    byId('delivery-search').addEventListener('input', renderDeliveries);
    all('[data-filter]').forEach((button) => button.addEventListener('click', () => {
      all('[data-filter]').forEach((item) => {
        item.classList.remove('active-filter', 'btn-dark');
        item.classList.add('btn-outline-dark');
      });
      button.classList.add('active-filter', 'btn-dark');
      button.classList.remove('btn-outline-dark');
      renderDeliveries();
    }));
    document.querySelector('[data-filter="todos"]')?.classList.add('active-filter');
  }

  function formAddress(form, type) {
    const field = (suffix) => byId(`${type}-${suffix}`).value.trim();
    return {
      tipo: type === 'origem' ? 'Origem' : 'Destino',
      cep: field('cep'), logradouro: field('logradouro'), numero: field('numero'),
      bairro: field('bairro'), cidade: field('cidade'), uf: field('uf').toUpperCase(),
    };
  }

  async function submitDelivery(event) {
    event.preventDefault();
    const form = event.currentTarget;
    hideAlert();
    form.classList.add('was-validated');
    if (!form.checkValidity()) { form.querySelector(':invalid')?.focus(); return; }
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    try {
      const value = Object.fromEntries(new FormData(form).entries());
      const delivery = await api('/entregas', { method: 'POST', body: JSON.stringify({
        clienteNome: value.clienteNome.trim(), clienteCpf: value.clienteCpf.trim(),
        clienteTelefone: value.clienteTelefone.trim(), produtoNome: value.produtoNome.trim(),
        produtoDescricao: value.produtoDescricao.trim(), dataPrevista: value.dataPrevista,
        status: value.status,
      }) });
      for (const type of ['origem', 'destino']) {
        await api('/enderecos', { method: 'POST', body: JSON.stringify({ entregaId: delivery.id, ...formAddress(form, type) }) });
      }
      window.location.href = '../index.html';
    } catch (error) {
      showAlert(`Não foi possível salvar a entrega. ${error.message}`);
    } finally { submit.disabled = false; }
  }

  async function lookupCep(type) {
    const input = byId(`${type}-cep`);
    const feedback = byId(`${type}-feedback`);
    const cep = input.value.replace(/\D/g, '');
    feedback.className = 'form-text';
    if (!/^\d{8}$/.test(cep)) { feedback.classList.add('text-danger'); feedback.textContent = 'Informe um CEP com 8 números.'; input.focus(); return; }
    feedback.textContent = 'Consultando CEP...';
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) throw new Error('Falha de conexão com o ViaCEP.');
      const address = await response.json();
      if (address.erro) { feedback.classList.add('text-danger'); feedback.textContent = 'CEP não encontrado. Confira o número e tente novamente.'; return; }
      byId(`${type}-logradouro`).value = address.logradouro || '';
      byId(`${type}-bairro`).value = address.bairro || '';
      byId(`${type}-cidade`).value = address.localidade || '';
      byId(`${type}-uf`).value = address.uf || '';
      feedback.classList.add('text-success');
      feedback.textContent = 'Endereço preenchido pelo ViaCEP. Complete o número.';
    } catch (error) { feedback.classList.add('text-danger'); feedback.textContent = `Não foi possível consultar o CEP. ${error.message}`; }
  }

  function fillAddress(prefix, address) {
    byId(`${prefix}-address-title`).textContent = [address?.logradouro, address?.numero].filter(Boolean).join(', ') || 'Endereço não informado';
    byId(`${prefix}-address-line`).textContent = [address?.bairro, address?.cidade || address?.localidade, address?.uf].filter(Boolean).join(', ') || '—';
    byId(`${prefix}-cep`).textContent = `CEP: ${address?.cep || '—'}`;
  }

  async function loadDetails() {
    const title = byId('detail-title');
    if (!title) return;
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) { showAlert('O identificador da entrega não foi informado.'); return; }
    try {
      const [delivery, addresses] = await Promise.all([api(`/entregas/${encodeURIComponent(id)}`), api(`/enderecos?entregaId=${encodeURIComponent(id)}`)]);
      const origin = addresses.find((item) => item.tipo?.toLocaleLowerCase('pt-BR') === 'origem');
      const destination = addresses.find((item) => item.tipo?.toLocaleLowerCase('pt-BR') === 'destino');
      title.textContent = `Entrega #${String(delivery.id).padStart(3, '0')}`;
      fillAddress('origin', origin || {});
      fillAddress('destination', destination || {});
      byId('detail-client').textContent = delivery.clienteNome || '—';
      byId('detail-cpf').textContent = delivery.clienteCpf || '—';
      byId('detail-phone').textContent = delivery.clienteTelefone || '—';
      byId('detail-product').textContent = delivery.produtoNome || '—';
      byId('detail-description').textContent = delivery.produtoDescricao || '—';
      byId('detail-date').textContent = localDate(delivery.dataPrevista);
      updateStatusDisplay(delivery.status);
      byId('modal-delivery-id').textContent = title.textContent;
      byId('new-status').value = delivery.status;
      byId('status-form').dataset.deliveryId = delivery.id;
    } catch (error) { showAlert(`Não foi possível carregar os detalhes da entrega. ${error.message}`); }
  }

  function updateStatusDisplay(status) {
    for (const id of ['detail-status', 'detail-status-secondary', 'modal-current-status']) {
      const badge = byId(id);
      if (badge) { badge.className = `ef-status ${statusClass(status)}`; badge.textContent = status || 'Sem status'; }
    }
  }

  async function saveStatus(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    try {
      const updated = await api(`/entregas/${encodeURIComponent(form.dataset.deliveryId)}`, { method: 'PATCH', body: JSON.stringify({ status: byId('new-status').value }) });
      updateStatusDisplay(updated.status);
      bootstrap.Modal.getOrCreateInstance(byId('status-modal')).hide();
      showAlert('Status atualizado com sucesso.', 'success');
    } catch (error) { showAlert(`Não foi possível atualizar o status. ${error.message}`); }
    finally { submit.disabled = false; }
  }

  wireFilters();
  loadDeliveries();
  byId('delivery-form')?.addEventListener('submit', submitDelivery);
  all('[data-cep]').forEach((button) => button.addEventListener('click', () => lookupCep(button.dataset.cep)));
  byId('status-form')?.addEventListener('submit', saveStatus);
  loadDetails();
})();
