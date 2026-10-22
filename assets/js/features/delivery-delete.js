import { formatDeliveryNumber } from '../utils/formatters.js';
import { hideAlert, modalActivity, modeLink, showAlert } from '../utils/feedback.js';

export function initDeliveryDelete(service, state) {
  const modal = document.getElementById('delete-modal');
  const form = document.getElementById('delete-form');
  const setModalBusy = modalActivity(modal);
  modal.addEventListener('show.bs.modal', () => hideAlert('delete-feedback'));
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (state.busy) return;
    hideAlert('delete-feedback');
    state.setBusy(true);
    setModalBusy(true);
    try {
      await service.delete(state.delivery.id);
      setModalBusy(false);
      bootstrap.Modal.getOrCreateInstance(modal).hide();
      window.location.assign(
        modeLink('../index.html', service.mode, {
          excluida: formatDeliveryNumber(state.delivery),
        }),
      );
    } catch (error) {
      showAlert(
        `Não foi possível excluir a entrega. ${error.message}`,
        'danger',
        'delete-feedback',
      );
    } finally {
      setModalBusy(false);
      state.setBusy(false);
    }
  });
}
