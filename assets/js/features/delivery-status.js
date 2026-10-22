import { validateForm } from '../utils/validation.js';
import { hideAlert, modalActivity, showAlert } from '../utils/feedback.js';

export function initDeliveryStatus(service, state) {
  const modal = document.getElementById('status-modal');
  const form = document.getElementById('status-form');
  const select = document.getElementById('new-status');
  const setModalBusy = modalActivity(modal);
  modal.addEventListener('show.bs.modal', () => {
    hideAlert('status-feedback');
    select.value = state.delivery.status;
  });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (state.busy || !validateForm(form)) return;
    hideAlert('status-feedback');
    state.setBusy(true);
    setModalBusy(true);
    try {
      const updated = await service.updateStatus(state.delivery.id, select.value);
      state.update(updated);
      setModalBusy(false);
      bootstrap.Modal.getOrCreateInstance(modal).hide();
      showAlert('Status atualizado com sucesso.', 'success');
    } catch (error) {
      showAlert(
        `Não foi possível atualizar o status. ${error.message}`,
        'danger',
        'status-feedback',
      );
    } finally {
      setModalBusy(false);
      state.setBusy(false);
    }
  });
}
