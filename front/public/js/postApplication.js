/* global createApplicationCard, _csrfToken*/

function setupModalControls (modal) {
  const inputEl = document.getElementById('inputAppName');
  const errorEl = document.getElementById('modalError');

  function openModal () {
    inputEl.value = '';
    errorEl.classList.add('hidden');
    errorEl.textContent = '';
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    inputEl.focus();
  }

  function closeModal () {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }

  function showModalError (msg) {
    errorEl.textContent = msg;
    errorEl.classList.remove('hidden');
  }

  document.getElementById('btnCloseModal').addEventListener('click', closeModal);
  document.getElementById('btnCancelModal').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  return { openModal, closeModal, showModalError };
}

function showToast (toast) {
  toast.classList.remove('hidden');
  toast.classList.add('flex');
  setTimeout(() => {
    toast.classList.add('hidden');
    toast.classList.remove('flex');
  }, 3000);
}

async function saveApplication (user, ctx) {
  const { inputAppName, closeModal, showModalError, toast } = ctx;
  const name = inputAppName.value.trim();

  if (!name) {
    showModalError('El nombre de la sesión es obligatorio');
    return;
  }
  if (name.length > 20) {
    showModalError('El nombre debe tener máximo 20 caracteres');
    return;
  }

  const btnSave = document.getElementById('btnSaveApp');
  btnSave.disabled = true;
  btnSave.classList.add('opacity-60');

  try {
    const response = await fetch(`/users/${user.idUser}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-csrf-token': _csrfToken },
      body: JSON.stringify({ application_name: name }),
    });
    const json = await response.json();

    if (!response.ok) {
      showModalError(json.error || 'Error al crear la sesión');
      return;
    }

    closeModal();
    showToast(toast);

<<<<<<< HEAD
    const addBtn = document.getElementById('btnCreateSession');
    addBtn.insertAdjacentHTML('beforebegin', createApplicationCard({
      idApplication: json.data.idApplication,
      applicationName: json.data.applicationName,
      status: json.data.status,
      createdAt: json.data.createdAt,
    }, user.idUser));
=======
    try {
      const response = await fetch(`/users/${user.idUser}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
          'x-csrf-token': '_csrfToken' },
        body: JSON.stringify({ application_name: name }),
      });
>>>>>>> 5efc3a6b5efb4b1d33d413406e64f47b944a037f

  } catch {
    showModalError('Error de red, intenta de nuevo');
  } finally {
    btnSave.disabled = false;
    btnSave.classList.remove('opacity-60');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const user = window.__USER_DATA__;
  if (!user) return;

  const modal        = document.getElementById('modalCreateApp');
  const inputAppName = document.getElementById('inputAppName');
  const toast        = document.getElementById('toast');
  const container    = document.getElementById('logbookContainer');

  const { openModal, closeModal, showModalError } = setupModalControls(modal);

  container.addEventListener('click', (e) => {
    if (e.target.closest('#btnCreateSession')) openModal();
  });

  document.getElementById('btnSaveApp').addEventListener('click', () => {
    saveApplication(user, { inputAppName, closeModal, showModalError, toast });
  });
});
