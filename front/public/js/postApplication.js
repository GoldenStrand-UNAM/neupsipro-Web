/* global createApplicationCard, _csrfToken*/

document.addEventListener('DOMContentLoaded', () => {
  const user = window.__USER_DATA__;

  if (!user) return;

  const modal        = document.getElementById('modalCreateApp');
  const inputAppName = document.getElementById('inputAppName');
  const modalError   = document.getElementById('modalError');
  const toast        = document.getElementById('toast');
  const container    = document.getElementById('logbookContainer');

  // Event delegation — btnCreateSession is injected dynamically
  container.addEventListener('click', (e) => {
    if (e.target.closest('#btnCreateSession')) openModal();
  });

  function openModal () {
    inputAppName.value = '';
    modalError.classList.add('hidden');
    modalError.textContent = '';
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    inputAppName.focus();
  }

  function closeModal () {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }

  document.getElementById('btnCloseModal').addEventListener('click', closeModal);
  document.getElementById('btnCancelModal').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  document.getElementById('btnSaveApp').addEventListener('click', async () => {
    const name = inputAppName.value.trim();

    // Client-side validation — mirrors server rules
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
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': _csrfToken},
        body: JSON.stringify({ application_name: name }),
      });

      const json = await response.json();

      if (!response.ok) {
        showModalError(json.error || 'Error al crear la sesión');
        return;
      }

      closeModal();
      showToast();

      // Prepend new card before the "Crear aplicación" button
      const addBtn = document.getElementById('btnCreateSession');
      addBtn.insertAdjacentHTML('beforebegin', createApplicationCard({
        idApplication: json.data.idApplication,
        applicationName: json.data.applicationName,
        status: json.data.status,
        createdAt: json.data.createdAt,
      }, user.idUser));

    } catch (_err) {
      showModalError('Error de red, intenta de nuevo');
    } finally {
      const btnSave = document.getElementById('btnSaveApp');
      btnSave.disabled = false;
      btnSave.classList.remove('opacity-60');
    }
  });

  function showModalError (msg) {
    modalError.textContent = msg;
    modalError.classList.remove('hidden');
  }

  function showToast () {
    toast.classList.remove('hidden');
    toast.classList.add('flex');
    setTimeout(() => {
      toast.classList.add('hidden');
      toast.classList.remove('flex');
    }, 3000);
  }
});