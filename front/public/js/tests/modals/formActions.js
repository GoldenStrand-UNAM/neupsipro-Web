/* exported buildModalFormActions, buildModalConsultActions, setModalSaveBusy */

// Shared action buttons for every test modal (REY, WAIS, BANFE, ...).
// Centralizes the Cancel / Save markup so all modals share the same
// component classes (.btn-cancel / .btn-save), icons, sizes and radius.

// X-circle icon used by the Cancel/Close button.
const _CANCEL_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
    <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
  </svg>`;

// Floppy-disk icon used by the Save button.
const _SAVE_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
    <path fill="none" stroke="currentColor" stroke-width="1.5" d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3zM15 4v5H6V4m6 14a3 3 0 1 1 0-6a3 3 0 0 1 0 6z"/>
  </svg>`;

// Cancel + Save footer for the editable (register/modify) form view.
function buildModalFormActions ({ cancelId, saveId }) {
  return `
    <div class="flex justify-end gap-3">
      <button id="${cancelId}" class="btn-cancel">
        ${_CANCEL_ICON}
        <span class="whitespace-nowrap">Cancelar</span>
      </button>
      <button id="${saveId}" class="btn-save">
        ${_SAVE_ICON}
        <span class="whitespace-nowrap">Guardar</span>
      </button>
    </div>`;
}

// Single close button for the read-only (consult) view.
function buildModalConsultActions ({ cancelId, label = 'Cerrar' }) {
  return `
    <div class="flex justify-end pt-4 border-t border-gray-200">
      <button id="${cancelId}" class="btn-cancel">
        ${_CANCEL_ICON}
        <span class="whitespace-nowrap">${label}</span>
      </button>
    </div>`;
}

// Toggles the busy state of a Save button while a request is in flight,
// preventing double submits. Safe to call after the modal is removed.
function setModalSaveBusy (saveId, busy) {
  const btn = document.getElementById(saveId);
  if (!btn) return;
  btn.disabled = busy;
  btn.classList.toggle('opacity-60', busy);
  btn.classList.toggle('pointer-events-none', busy);
}
