import { lookupCep } from '../services/viacep.js';
import {
  digits,
  formatCep,
  formatCpf,
  formatPhone,
  validateField,
  validateForm,
} from '../utils/validation.js';
import { hideAlert, modeLink, showAlert } from '../utils/feedback.js';

function formAddress(type) {
  const field = (suffix) => document.getElementById(`${type}-${suffix}`).value.trim();
  return {
    tipo: type === 'origem' ? 'Origem' : 'Destino',
    cep: formatCep(field('cep')),
    logradouro: field('logradouro'),
    numero: field('numero'),
    bairro: field('bairro'),
    cidade: field('cidade'),
    uf: field('uf').toUpperCase(),
  };
}

function initCepLookup() {
  const $ = jQuery;
  const requests = {};
  for (const type of ['origem', 'destino']) {
    const input = document.getElementById(`${type}-cep`);
    const feedback = $(`#${type}-feedback`);
    $(input).on('input', () => {
      requests[type] = Symbol(type);
      feedback.removeClass('text-success text-danger').text('');
    });
    $(`[data-cep="${type}"]`).on('click', async () => {
      const cep = digits(input.value);
      const request = Symbol(type);
      requests[type] = request;
      feedback.removeClass('text-success text-danger');
      if (!/^\d{8}$/.test(cep)) {
        feedback.addClass('text-danger').text('Informe um CEP com 8 números.');
        input.focus();
        return;
      }
      feedback.text('Consultando CEP...');
      try {
        const address = await lookupCep(cep);
        if (requests[type] !== request || digits(input.value) !== cep) return;
        const fields = {
          logradouro: address.logradouro || '',
          bairro: address.bairro || '',
          cidade: address.localidade || '',
          uf: address.uf || '',
        };
        for (const [suffix, value] of Object.entries(fields)) {
          const field = document.getElementById(`${type}-${suffix}`);
          $(field).val(value);
          validateField(field);
        }
        feedback
          .addClass('text-success')
          .text('Endereço preenchido pelo ViaCEP. Complete o número.');
      } catch (error) {
        if (requests[type] !== request || digits(input.value) !== cep) return;
        feedback.addClass('text-danger').text(`Não foi possível consultar o CEP. ${error.message}`);
      }
    });
  }
}

export function initDeliveryCreate(service) {
  const form = document.getElementById('delivery-form');
  const submit = form.querySelector('[type="submit"]');
  let saving = false;
  submit.disabled = false;
  initCepLookup();
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (saving) return;
    hideAlert();
    if (!validateForm(form)) return;
    saving = true;
    submit.disabled = true;
    form.setAttribute('aria-busy', 'true');
    try {
      const value = Object.fromEntries(new FormData(form).entries());
      const delivery = {
        clienteNome: value.clienteNome.trim(),
        clienteCpf: formatCpf(value.clienteCpf),
        clienteTelefone: formatPhone(value.clienteTelefone),
        produtoNome: value.produtoNome.trim(),
        produtoDescricao: value.produtoDescricao.trim(),
        dataPrevista: value.dataPrevista,
        status: value.status,
      };
      await service.create(delivery, ['origem', 'destino'].map(formAddress));
      window.location.assign(modeLink('../index.html', service.mode));
    } catch (error) {
      showAlert(`Não foi possível salvar a entrega. ${error.message}`);
    } finally {
      saving = false;
      submit.disabled = false;
      form.setAttribute('aria-busy', 'false');
    }
  });
}
