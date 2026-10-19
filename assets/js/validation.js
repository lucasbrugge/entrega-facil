(function () {
  'use strict';

  const statuses = ['Pendente', 'Em transporte', 'Entregue', 'Cancelada'];
  const digits = (value) => String(value).replace(/\D/g, '');
  const validCpf = (value) => {
    const cpf = digits(value);
    if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;
    for (let size = 9; size <= 10; size++) {
      const sum = [...cpf.slice(0, size)].reduce(
        (total, digit, index) => total + Number(digit) * (size + 1 - index),
        0,
      );
      const check = ((sum * 10) % 11) % 10;
      if (check !== Number(cpf[size])) return false;
    }
    return true;
  };
  const validPhone = (value) => /^[1-9]\d(?:\d{8}|\d{9})$/.test(digits(value));
  const validCep = (value) => /^\d{8}$/.test(digits(value));
  const validDate = (value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000')) return false;
    const date = new Date(`${value}T12:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  };
  const formatCpf = (value) =>
    digits(value).replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  const formatCep = (value) => digits(value).replace(/^(\d{5})(\d{3})$/, '$1-$2');
  const formatPhone = (value) => digits(value).replace(/^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3');

  function validateField(field) {
    field.setCustomValidity('');
    const value = field.value.trim();
    let message = '';
    const label = document
      .querySelector(`label[for="${field.id}"]`)
      ?.textContent.replace('*', '')
      .trim();
    if (!value && field.required) message = `Preencha o campo ${label || 'obrigatório'}.`;
    else if (field.id === 'cliente-cpf' && !validCpf(value))
      message = 'Informe um CPF válido com 11 dígitos e dígitos verificadores corretos.';
    else if (field.id === 'cliente-telefone' && !validPhone(value))
      message = 'Informe telefone com DDD válido e 10 ou 11 dígitos.';
    else if (field.id.endsWith('-cep') && !validCep(value))
      message = 'Informe um CEP com exatamente 8 dígitos.';
    else if (field.id.endsWith('-uf') && !/^[A-Za-z]{2}$/.test(value))
      message = 'Informe a UF com duas letras.';
    else if (field.id === 'data-prevista' && !validDate(value))
      message = 'Informe uma data prevista válida.';
    else if ((field.id === 'status' || field.id === 'new-status') && !statuses.includes(value))
      message = 'Selecione um status permitido.';
    else if (!field.validity.valid) message = 'Confira o formato e o tamanho do valor informado.';
    field.setCustomValidity(message);
    const feedback = document.getElementById(`${field.id}-error`);
    if (feedback) feedback.textContent = message;
    field.setAttribute('aria-invalid', String(Boolean(message)));
    return !message;
  }

  function validateForm(form) {
    form.querySelectorAll('input, select, textarea').forEach(validateField);
    form.classList.add('was-validated');
    const valid = form.checkValidity();
    if (!valid) form.querySelector(':invalid')?.focus();
    return valid;
  }

  window.EntregaFacilValidation = {
    digits,
    validCpf,
    validPhone,
    validCep,
    validDate,
    formatCpf,
    formatCep,
    formatPhone,
    statuses,
    validateField,
    validateForm,
  };
  for (const form of document.querySelectorAll('#delivery-form, #status-form')) {
    for (const event of ['input', 'change']) {
      form.addEventListener(event, ({ target }) => {
        if (target.matches('input, select, textarea') && form.classList.contains('was-validated'))
          validateField(target);
      });
    }
  }
})();
