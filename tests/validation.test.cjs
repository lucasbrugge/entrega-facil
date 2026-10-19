const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const window = {};
vm.runInNewContext(fs.readFileSync('assets/js/validation.js', 'utf8'), {
  window,
  document: { querySelectorAll: () => [] },
});
const rules = window.EntregaFacilValidation;

test('CPF: algoritmo verifica ambos os dígitos e rejeita sequências repetidas', () => {
  for (const value of ['529.982.247-25', '11144477735', '12345678909'])
    assert.equal(rules.validCpf(value), true);
  for (const value of [
    '',
    '00000000000',
    '11111111111',
    '52998224724',
    '5299822472',
    '12345678900',
  ])
    assert.equal(rules.validCpf(value), false);
});
test('regex: telefone com DDD e CEP de oito dígitos', () => {
  for (const value of ['(42) 3333-4444', '(42) 99999-4444'])
    assert.equal(rules.validPhone(value), true);
  for (const value of ['999994444', '(00) 3333-4444', '42333', '4299999444444'])
    assert.equal(rules.validPhone(value), false);
  assert.equal(rules.validCep('01001-000'), true);
  for (const value of ['', '0100100', '010010000']) assert.equal(rules.validCep(value), false);
});
test('data exige formato e dia real; serialização é consistente com e sem máscaras', () => {
  assert.equal(rules.validDate('2028-02-29'), true);
  for (const value of ['2026-02-29', '2026-13-01', '0000-01-01', 'hoje', ''])
    assert.equal(rules.validDate(value), false);
  assert.equal(rules.formatCpf('52998224725'), '529.982.247-25');
  assert.equal(rules.formatCep('01001000'), '01001-000');
  assert.equal(rules.formatPhone('4233334444'), '(42) 3333-4444');
  assert.equal(rules.formatPhone('42999994444'), '(42) 99999-4444');
});
