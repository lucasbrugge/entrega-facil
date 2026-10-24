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
  const color =
    {
      Pendente: 'warning',
      'Em transporte': 'primary',
      Entregue: 'success',
      Cancelada: 'danger',
    }[status] || 'secondary';
  return `badge border fw-medium text-uppercase text-${color}-emphasis bg-${color}-subtle border-${color}-subtle`;
}

export function statusBadge(status) {
  const badge = document.createElement('span');
  badge.className = statusClass(status);
  badge.textContent = status || 'Sem status';
  return badge;
}
