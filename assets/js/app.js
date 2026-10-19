(function () {
  'use strict';

  // Keep the documented JSON Server contract configurable for local environments.
  const API_URL = window.ENTREGA_FACIL_API_URL || 'http://localhost:3000';
  const demo = window.EntregaFacilDemo;
  const validation = window.EntregaFacilValidation;
  let dataSource = 'unknown';
  let currentDelivery = null;
  let currentAddresses = [];
  let pendingCreation = null;
  const all = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const byId = (id) => document.getElementById(id);

  async function api(path, options = {}) {
    let response;
    try {
      response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      });
    } catch (error) {
      error.apiUnavailable = true;
      throw error;
    }
    if (!response.ok) {
      const error = new Error(`A API respondeu com status ${response.status}.`);
      error.status = response.status;
      throw error;
    }
    if (response.status === 204) return null;
    return response.json();
  }

  function apiUnavailable(error) {
    return error.apiUnavailable === true || error.status >= 500;
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
    if (box) {
      box.className = 'alert d-none';
      box.textContent = '';
    }
  }

  function showDemoNotice() {
    showAlert(
      'JSON Server indisponível. Exibindo dados de demonstração; alterações ficam salvas somente neste navegador.',
      'warning',
    );
  }

  function statusClass(status = '') {
    return `status-${status
      .toLocaleLowerCase('pt-BR')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')}`;
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
      dataSource = 'api';
      hideAlert();
      setDeliveries(deliveries, addresses);
    } catch (error) {
      if (apiUnavailable(error)) {
        dataSource = 'demo';
        const sample = demo.snapshot();
        setDeliveries(sample.entregas, sample.enderecos);
        showDemoNotice();
      } else {
        showAlert(`Não foi possível carregar as entregas da API em ${API_URL}. ${error.message}`);
        byId('delivery-empty').classList.remove('d-none');
      }
    }
  }

  function setDeliveries(deliveries, addresses) {
    window.entregaFacilItems = deliveries.map((delivery) => ({
      ...delivery,
      addresses: addresses.filter((address) => String(address.entregaId) === String(delivery.id)),
    }));
    byId('delivery-count').textContent = window.entregaFacilItems.length;
    renderDeliveries();
  }

  function renderDeliveries() {
    const list = byId('delivery-list');
    if (!list) return;
    const query = (byId('delivery-search').value || '').trim().toLocaleLowerCase('pt-BR');
    const filter = document.querySelector('[data-filter].active-filter')?.dataset.filter || 'todos';
    const items = (window.entregaFacilItems || []).filter((delivery) => {
      const text =
        `${delivery.id} ${delivery.clienteNome} ${delivery.produtoNome}`.toLocaleLowerCase('pt-BR');
      return (!query || text.includes(query)) && (filter === 'todos' || delivery.status === filter);
    });
    list.replaceChildren(
      ...items.map((delivery) => {
        const origin = delivery.addresses.find(
          (address) => address.tipo?.toLocaleLowerCase('pt-BR') === 'origem',
        );
        const destination = delivery.addresses.find(
          (address) => address.tipo?.toLocaleLowerCase('pt-BR') === 'destino',
        );
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
        footer.className =
          'card-footer ef-card-footer d-flex justify-content-between align-items-center gap-2';
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
      }),
    );
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
    all('[data-filter]').forEach((button) =>
      button.addEventListener('click', () => {
        all('[data-filter]').forEach((item) => {
          item.classList.remove('active-filter', 'btn-dark');
          item.classList.add('btn-outline-dark');
        });
        button.classList.add('active-filter', 'btn-dark');
        button.classList.remove('btn-outline-dark');
        renderDeliveries();
      }),
    );
    document.querySelector('[data-filter="todos"]')?.classList.add('active-filter');
  }

  function formAddress(form, type) {
    const field = (suffix) => byId(`${type}-${suffix}`).value.trim();
    return {
      tipo: type === 'origem' ? 'Origem' : 'Destino',
      cep: validation.formatCep(field('cep')),
      logradouro: field('logradouro'),
      numero: field('numero'),
      bairro: field('bairro'),
      cidade: field('cidade'),
      uf: field('uf').toUpperCase(),
    };
  }

  async function submitDelivery(event) {
    event.preventDefault();
    const form = event.currentTarget;
    hideAlert();
    if (!validation.validateForm(form)) return;
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    try {
      const value = Object.fromEntries(new FormData(form).entries());
      if (dataSource === 'unknown') {
        try {
          await Promise.all([api('/entregas'), api('/enderecos')]);
          dataSource = 'api';
        } catch (error) {
          if (!apiUnavailable(error)) throw error;
          dataSource = 'demo';
        }
      }

      const deliveryData = {
        clienteNome: value.clienteNome.trim(),
        clienteCpf: validation.formatCpf(value.clienteCpf),
        clienteTelefone: validation.formatPhone(value.clienteTelefone),
        produtoNome: value.produtoNome.trim(),
        produtoDescricao: value.produtoDescricao.trim(),
        dataPrevista: value.dataPrevista,
        status: value.status,
      };

      if (dataSource === 'demo') {
        saveDemoDelivery(deliveryData, form);
        window.location.href = '../index.html';
        return;
      }

      // IDs conhecidos permitem compensar até POST que foi persistido, mas perdeu a resposta.
      if (pendingCreation) await undoCreation(pendingCreation);
      const deliveryId = crypto.randomUUID();
      pendingCreation = {
        deliveryId,
        addresses: ['origem', 'destino'].map((type) => ({
          id: crypto.randomUUID(),
          entregaId: deliveryId,
          ...formAddress(form, type),
        })),
      };
      try {
        await api('/entregas', {
          method: 'POST',
          body: JSON.stringify({ ...deliveryData, id: deliveryId }),
        });
        for (const address of pendingCreation.addresses) {
          await api('/enderecos', { method: 'POST', body: JSON.stringify(address) });
        }
      } catch (error) {
        try {
          await undoCreation(pendingCreation);
        } catch (cleanupError) {
          throw new Error(`${error.message} ${cleanupError.message}`, { cause: cleanupError });
        }
        throw new Error(
          `${error.message} O cadastro incompleto foi desfeito. Você pode tentar novamente.`,
          { cause: error },
        );
      }
      pendingCreation = null;
      window.location.href = '../index.html';
    } catch (error) {
      showAlert(`Não foi possível salvar a entrega. ${error.message}`);
    } finally {
      submit.disabled = false;
    }
  }

  async function undoCreation(creation) {
    const paths = creation.addresses.map(({ id }) => `/enderecos/${encodeURIComponent(id)}`);
    paths.push(`/entregas/${encodeURIComponent(creation.deliveryId)}`);
    const results = await Promise.allSettled(
      paths.map(async (path) => {
        try {
          await api(path, { method: 'DELETE' });
        } catch (error) {
          if (error.status !== 404) throw error;
        }
      }),
    );
    if (results.some((result) => result.status === 'rejected')) {
      throw new Error(
        `A limpeza do cadastro ${creation.deliveryId} não terminou. Restabeleça a API e tente novamente nesta página; nenhum novo cadastro será enviado antes da limpeza. Se sair desta página, confira esse ID na API antes de cadastrar novamente.`,
      );
    }
    pendingCreation = null;
  }

  function saveDemoDelivery(delivery, form) {
    const addresses = ['origem', 'destino'].map((type) => formAddress(form, type));
    demo.saveDelivery(delivery, addresses);
  }

  const cepRequests = {};
  async function lookupCep(type) {
    const input = byId(`${type}-cep`);
    const feedback = byId(`${type}-feedback`);
    const cep = input.value.replace(/\D/g, '');
    const request = Symbol(type);
    cepRequests[type] = request;
    feedback.className = 'form-text';
    if (!/^\d{8}$/.test(cep)) {
      feedback.classList.add('text-danger');
      feedback.textContent = 'Informe um CEP com 8 números.';
      input.focus();
      return;
    }
    feedback.textContent = 'Consultando CEP...';
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) throw new Error('Falha de conexão com o ViaCEP.');
      const address = await response.json();
      if (cepRequests[type] !== request || input.value.replace(/\D/g, '') !== cep) return;
      if (address.erro) {
        feedback.classList.add('text-danger');
        feedback.textContent = 'CEP não encontrado. Confira o número e tente novamente.';
        return;
      }
      byId(`${type}-logradouro`).value = address.logradouro || '';
      byId(`${type}-bairro`).value = address.bairro || '';
      byId(`${type}-cidade`).value = address.localidade || '';
      byId(`${type}-uf`).value = address.uf || '';
      feedback.classList.add('text-success');
      feedback.textContent = 'Endereço preenchido pelo ViaCEP. Complete o número.';
    } catch (error) {
      if (cepRequests[type] !== request || input.value.replace(/\D/g, '') !== cep) return;
      feedback.classList.add('text-danger');
      feedback.textContent = `Não foi possível consultar o CEP. ${error.message}`;
    }
  }

  function fillAddress(prefix, address) {
    byId(`${prefix}-address-title`).textContent =
      [address?.logradouro, address?.numero].filter(Boolean).join(', ') || 'Endereço não informado';
    byId(`${prefix}-address-line`).textContent =
      [address?.bairro, address?.cidade || address?.localidade, address?.uf]
        .filter(Boolean)
        .join(', ') || '—';
    byId(`${prefix}-cep`).textContent = `CEP: ${address?.cep || '—'}`;
  }

  async function loadDetails() {
    const title = byId('detail-title');
    if (!title) return;
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) {
      showAlert('O identificador da entrega não foi informado.');
      return;
    }
    try {
      const [delivery, addresses] = await Promise.all([
        api(`/entregas/${encodeURIComponent(id)}`),
        api(`/enderecos?entregaId=${encodeURIComponent(id)}`),
      ]);
      dataSource = 'api';
      hideAlert();
      displayDetails(delivery, addresses);
    } catch (error) {
      if (apiUnavailable(error)) {
        dataSource = 'demo';
        const delivery = demo.findDelivery(id);
        if (delivery) {
          const addresses = demo
            .snapshot()
            .enderecos.filter((item) => String(item.entregaId) === String(id));
          showDemoNotice();
          displayDetails(delivery, addresses);
        } else {
          showAlert(
            'JSON Server indisponível. Esta entrega não está nos dados de demonstração locais.',
            'warning',
          );
        }
      } else {
        showAlert(`Não foi possível carregar os detalhes da entrega. ${error.message}`);
      }
    }
  }

  function displayDetails(delivery, addresses) {
    const origin = addresses.find((item) => item.tipo?.toLocaleLowerCase('pt-BR') === 'origem');
    const destination = addresses.find(
      (item) => item.tipo?.toLocaleLowerCase('pt-BR') === 'destino',
    );
    currentDelivery = delivery;
    currentAddresses = addresses;
    byId('detail-title').textContent = `Entrega #${String(delivery.id).padStart(3, '0')}`;
    fillAddress('origin', origin || {});
    fillAddress('destination', destination || {});
    byId('detail-client').textContent = delivery.clienteNome || '—';
    byId('detail-cpf').textContent = delivery.clienteCpf || '—';
    byId('detail-phone').textContent = delivery.clienteTelefone || '—';
    byId('detail-product').textContent = delivery.produtoNome || '—';
    byId('detail-description').textContent = delivery.produtoDescricao || '—';
    byId('detail-date').textContent = localDate(delivery.dataPrevista);
    updateStatusDisplay(delivery.status);
    byId('modal-delivery-id').textContent = byId('detail-title').textContent;
    byId('new-status').value = delivery.status;
    byId('status-form').dataset.deliveryId = delivery.id;
  }

  function updateStatusDisplay(status) {
    for (const id of ['detail-status', 'detail-status-secondary', 'modal-current-status']) {
      const badge = byId(id);
      if (badge) {
        badge.className = `ef-status ${statusClass(status)}`;
        badge.textContent = status || 'Sem status';
      }
    }
  }

  async function saveStatus(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!validation.validateForm(form)) return;
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    try {
      const status = byId('new-status').value;
      if (dataSource === 'demo') {
        const updated = demo.updateStatus(form.dataset.deliveryId, status);
        if (!updated) throw new Error('A entrega de demonstração não foi encontrada.');
        currentDelivery = updated;
        updateStatusDisplay(updated.status);
        bootstrap.Modal.getOrCreateInstance(byId('status-modal')).hide();
        showAlert('Status atualizado nos dados de demonstração deste navegador.', 'warning');
        return;
      }

      const updated = await api(`/entregas/${encodeURIComponent(form.dataset.deliveryId)}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: byId('new-status').value }),
      });
      updateStatusDisplay(updated.status);
      currentDelivery = updated;
      bootstrap.Modal.getOrCreateInstance(byId('status-modal')).hide();
      showAlert('Status atualizado com sucesso.', 'success');
    } catch (error) {
      if (apiUnavailable(error) && currentDelivery) {
        dataSource = 'demo';
        demo.upsertDelivery(currentDelivery, currentAddresses);
        const updated = demo.updateStatus(currentDelivery.id, byId('new-status').value);
        currentDelivery = updated;
        updateStatusDisplay(updated.status);
        bootstrap.Modal.getOrCreateInstance(byId('status-modal')).hide();
        showAlert(
          'JSON Server indisponível. Status atualizado somente nos dados de demonstração deste navegador.',
          'warning',
        );
      } else {
        showAlert(`Não foi possível atualizar o status. ${error.message}`);
      }
    } finally {
      submit.disabled = false;
    }
  }

  wireFilters();
  loadDeliveries();
  byId('delivery-form')?.addEventListener('submit', submitDelivery);
  all('[data-cep]').forEach((button) =>
    button.addEventListener('click', () => lookupCep(button.dataset.cep)),
  );
  byId('status-form')?.addEventListener('submit', saveStatus);
  loadDetails();
})();
