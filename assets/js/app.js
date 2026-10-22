import { createDeliveryService } from './services/delivery-service.js';
import { initDeliveryList } from './features/delivery-list.js';
import { initDeliveryCreate } from './features/delivery-create.js';
import { initDeliveryDetails } from './features/delivery-details.js';
import { initValidation } from './utils/validation.js';
import { initMasks } from './utils/masks.js';
import { preserveModeLinks, showAlert, showDemoNotice } from './utils/feedback.js';

async function init() {
  const createPage = document.getElementById('delivery-form');
  const listPage = document.getElementById('delivery-list');
  const detailsPage = document.getElementById('detail-title');
  initValidation();
  if (createPage) initMasks();
  preserveModeLinks(new URLSearchParams(window.location.search).get('modo'));
  try {
    const service = await createDeliveryService();
    // Recarregar mantém a mesma origem de dados, mesmo se a API mudar de disponibilidade.
    const url = new URL(window.location.href);
    url.searchParams.set('modo', service.mode);
    window.history.replaceState(window.history.state, '', url);
    preserveModeLinks(service.mode);
    showDemoNotice(service.mode);
    if (listPage) await initDeliveryList(service);
    if (createPage) initDeliveryCreate(service);
    if (detailsPage) await initDeliveryDetails(service);
  } catch (error) {
    showAlert(`Não foi possível iniciar esta página. ${error.message}`);
    listPage?.setAttribute('aria-busy', 'false');
  }
}

init();
