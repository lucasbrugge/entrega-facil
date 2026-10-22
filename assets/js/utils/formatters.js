export function formatDeliveryNumber(delivery) {
  const number = Number(delivery.numeroEntrega);
  return Number.isSafeInteger(number) && number > 0 ? String(number).padStart(3, '0') : '—';
}

export function localDate(value) {
  if (!value) return '—';
  const [year, month, day] = String(value).slice(0, 10).split('-');
  return year && month && day ? `${day}/${month}/${year}` : value;
}

export function addressCity(address) {
  if (!address) return '—';
  return `${address.cidade || address.localidade || '—'}${address.uf ? ` - ${address.uf}` : ''}`;
}

export function statusClass(status = '') {
  return `status-${status
    .toLocaleLowerCase('pt-BR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')}`;
}

export function statusBadge(status) {
  const badge = document.createElement('span');
  badge.className = `ef-status ${statusClass(status)}`;
  badge.textContent = status || 'Sem status';
  return badge;
}
