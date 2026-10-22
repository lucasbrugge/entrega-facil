export function initMasks() {
  const $ = jQuery;
  $('#cliente-cpf').mask('000.000.000-00');
  $('#origem-cep, #destino-cep').mask('00000-000');
  const phoneMask = (value) =>
    value.replace(/\D/g, '').length > 10 ? '(00) 00000-0000' : '(00) 0000-00009';
  const options = {
    onKeyPress(value, event, field) {
      $(field).mask(phoneMask(value), options);
    },
  };
  $('#cliente-telefone').mask(phoneMask, options);
  // O dígito opcional permite digitar o 11º número sem truncá-lo na máscara de fixo.
  $('#cliente-telefone').on('blur', function () {
    $(this).mask(phoneMask($(this).val()), options);
  });
}
