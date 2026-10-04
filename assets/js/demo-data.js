(function () {
  'use strict';

  const STORAGE_KEY = 'entrega-facil-demo-data-v1';
  const initialData = {
    entregas: [
      {
        id: 'demo-001', clienteNome: 'João Silva', clienteCpf: '000.000.000-00',
        clienteTelefone: '(00) 90000-0001', produtoNome: 'Notebook',
        produtoDescricao: 'Notebook para entrega de demonstração.',
        dataPrevista: '2026-10-10', status: 'Pendente',
      },
      {
        id: 'demo-002', clienteNome: 'Marina Costa', clienteCpf: '000.000.000-00',
        clienteTelefone: '(00) 90000-0002', produtoNome: 'Cadeira de escritório',
        produtoDescricao: 'Cadeira ergonômica embalada para transporte.',
        dataPrevista: '2026-10-12', status: 'Em transporte',
      },
      {
        id: 'demo-003', clienteNome: 'Rafael Mendes', clienteCpf: '000.000.000-00',
        clienteTelefone: '(00) 90000-0003', produtoNome: 'Monitor 27 polegadas',
        produtoDescricao: 'Monitor com embalagem reforçada.',
        dataPrevista: '2026-10-14', status: 'Entregue',
      },
      {
        id: 'demo-004', clienteNome: 'Ana Oliveira', clienteCpf: '000.000.000-00',
        clienteTelefone: '(00) 90000-0004', produtoNome: 'Impressora',
        produtoDescricao: 'Impressora para escritório.',
        dataPrevista: '2026-10-16', status: 'Cancelada',
      },
    ],
    enderecos: [
      { id: 'demo-a1', entregaId: 'demo-001', tipo: 'Origem', cep: '85000-000', logradouro: 'Rua Exemplo', numero: '100', bairro: 'Centro', cidade: 'Guarapuava', uf: 'PR' },
      { id: 'demo-a2', entregaId: 'demo-001', tipo: 'Destino', cep: '80000-000', logradouro: 'Avenida Modelo', numero: '250', bairro: 'Centro', cidade: 'Curitiba', uf: 'PR' },
      { id: 'demo-a3', entregaId: 'demo-002', tipo: 'Origem', cep: '84010-000', logradouro: 'Rua das Flores', numero: '45', bairro: 'Centro', cidade: 'Ponta Grossa', uf: 'PR' },
      { id: 'demo-a4', entregaId: 'demo-002', tipo: 'Destino', cep: '80010-000', logradouro: 'Rua do Mercado', numero: '810', bairro: 'São Francisco', cidade: 'Curitiba', uf: 'PR' },
      { id: 'demo-a5', entregaId: 'demo-003', tipo: 'Origem', cep: '86010-000', logradouro: 'Rua Paraná', numero: '32', bairro: 'Centro', cidade: 'Londrina', uf: 'PR' },
      { id: 'demo-a6', entregaId: 'demo-003', tipo: 'Destino', cep: '87013-000', logradouro: 'Avenida Brasil', numero: '120', bairro: 'Zona 01', cidade: 'Maringá', uf: 'PR' },
      { id: 'demo-a7', entregaId: 'demo-004', tipo: 'Origem', cep: '85015-000', logradouro: 'Rua XV de Novembro', numero: '77', bairro: 'Centro', cidade: 'Guarapuava', uf: 'PR' },
      { id: 'demo-a8', entregaId: 'demo-004', tipo: 'Destino', cep: '84020-000', logradouro: 'Rua do Lago', numero: '19', bairro: 'Uvaranas', cidade: 'Ponta Grossa', uf: 'PR' },
    ],
  };

  let memoryData = clone(initialData);

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function read() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return clone(initialData);
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed.entregas) && Array.isArray(parsed.enderecos)) return parsed;
    } catch (error) {
      // Keep the demo usable when storage is disabled (for example, in private mode).
    }
    return clone(memoryData);
  }

  function write(data) {
    memoryData = clone(data);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      // The in-memory copy still works for the current page if storage is unavailable.
    }
  }

  function nextId(items, prefix) {
    const max = items.reduce((highest, item) => {
      const match = String(item.id).match(/(\d+)$/);
      return Math.max(highest, match ? Number(match[1]) : 0);
    }, 0);
    return `${prefix}${String(max + 1).padStart(3, '0')}`;
  }

  window.EntregaFacilDemo = {
    snapshot() {
      return clone(read());
    },

    findDelivery(id) {
      return read().entregas.find((delivery) => String(delivery.id) === String(id)) || null;
    },

    saveDelivery(delivery, addresses) {
      const data = read();
      const id = nextId(data.entregas, 'demo-');
      const savedDelivery = { ...delivery, id };
      const savedAddresses = [];
      addresses.forEach((address) => savedAddresses.push({
        ...address,
        id: nextId([...data.enderecos, ...savedAddresses], 'demo-a'),
        entregaId: id,
      }));
      data.entregas.push(savedDelivery);
      data.enderecos.push(...savedAddresses);
      write(data);
      return clone(savedDelivery);
    },

    upsertDelivery(delivery, addresses) {
      const data = read();
      const index = data.entregas.findIndex((item) => String(item.id) === String(delivery.id));
      if (index === -1) data.entregas.push(clone(delivery));
      else data.entregas[index] = { ...data.entregas[index], ...clone(delivery) };
      data.enderecos = data.enderecos.filter((address) => String(address.entregaId) !== String(delivery.id));
      data.enderecos.push(...clone(addresses));
      write(data);
    },

    updateStatus(id, status) {
      const data = read();
      const delivery = data.entregas.find((item) => String(item.id) === String(id));
      if (!delivery) return null;
      delivery.status = status;
      write(data);
      return clone(delivery);
    },
  };

})();
