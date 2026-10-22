export async function lookupCep(cep) {
  const digits = String(cep).replace(/\D/g, '');
  if (!/^\d{8}$/.test(digits)) throw new Error('Informe um CEP com 8 números.');
  const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`, {
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error('Falha de conexão com o ViaCEP.');
  const address = await response.json();
  if (address.erro) throw new Error('CEP não encontrado. Confira o número e tente novamente.');
  return address;
}
