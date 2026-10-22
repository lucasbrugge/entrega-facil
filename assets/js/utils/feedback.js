export function showAlert(message, type = 'danger', region = 'app-alert') {
  const box = document.getElementById(region);
  if (!box) return;
  box.className = `alert alert-${type}`;
  box.setAttribute('role', type === 'danger' ? 'alert' : 'status');
  box.textContent = message;
}

export function hideAlert(region = 'app-alert') {
  const box = document.getElementById(region);
  if (!box) return;
  box.className = 'alert d-none';
  box.textContent = '';
}

export function showDemoNotice(mode) {
  if (mode !== 'demo') {
    hideAlert('persistence-notice');
    return;
  }
  showAlert(
    'Modo demonstração: alterações salvas somente neste navegador, sem sincronização com a API.',
    'warning',
    'persistence-notice',
  );
}

export function modeLink(path, mode, parameters = {}) {
  const url = new URL(path, window.location.href);
  url.searchParams.set('modo', mode);
  for (const [name, value] of Object.entries(parameters)) url.searchParams.set(name, value);
  return url.href;
}

export function preserveModeLinks(mode) {
  if (!['api', 'demo'].includes(mode)) return;
  for (const link of document.querySelectorAll('a[href]')) {
    const url = new URL(link.getAttribute('href'), window.location.href);
    if (url.origin === window.location.origin && url.pathname.endsWith('.html')) {
      link.href = modeLink(url.href, mode);
    }
  }
}

// Impede fechar o modal pelo Escape, backdrop ou botões durante uma gravação.
// O bloqueio é compartilhado pelos dois fluxos, sem misturar as operações de dados.
export function modalActivity(modal) {
  let busy = false;
  modal.addEventListener('hide.bs.modal', (event) => {
    if (busy) event.preventDefault();
  });
  return (active) => {
    busy = active;
    modal.setAttribute('aria-busy', String(active));
    for (const control of modal.querySelectorAll('button, select')) control.disabled = active;
  };
}
