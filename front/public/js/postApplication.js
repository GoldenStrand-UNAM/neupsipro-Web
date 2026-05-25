/* global createApplicationCard, _csrfToken*/

const MAX_APPLICATIONS = 5;

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

function showSuccessToast (msg) {
  const el = document.createElement('div');
  el.className = 'fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#002B7A] text-white px-5 py-3 rounded-xl shadow-lg text-sm';
  el.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
         stroke-width="2" stroke="currentColor" class="w-5 h-5 shrink-0">
      <path stroke-linecap="round" stroke-linejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
    </svg>
    <span>${msg}</span>
  `;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

function syncAddButton () {
  const addBtn  = document.getElementById('btnCreateSession');
  const logbook = document.getElementById('logbookContainer');
  if (!addBtn || !logbook) return;
  addBtn.style.display = logbook.querySelectorAll('a').length >= MAX_APPLICATIONS ? 'none' : '';
}

// Shows a red toast when the application limit is reached
function showLimitToast () {
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-red-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm';
  toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
         stroke-width="2" stroke="currentColor" class="w-5 h-5 shrink-0">
      <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0
               2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898
               0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/>
    </svg>
    <span>Límite alcanzado — máximo 5 aplicaciones por usuario</span>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

async function saveApplication (user, ctx) {
  const { inputAppName, closeModal, showModalError } = ctx;
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
    showSuccessToast('Aplicación creada con éxito');

    const addBtn = document.getElementById('btnCreateSession');
    addBtn.insertAdjacentHTML('beforebegin', createApplicationCard({
      idApplication: json.data.idApplication,
      applicationName: json.data.applicationName,
      status: json.data.status,
      createdAt: json.data.createdAt,
    }, user.idUser));

    syncAddButton();

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
  const container    = document.getElementById('logbookContainer');

  const { openModal, closeModal, showModalError } = setupModalControls(modal);

  // Hide add button on load if limit already reached
  container.addEventListener('DOMSubtreeModified', () => {
    const addBtn    = document.getElementById('btnCreateSession');
    const cardCount = container.querySelectorAll('a').length;
    if (addBtn) addBtn.style.display = cardCount >= MAX_APPLICATIONS ? 'none' : '';
  });

  container.addEventListener('click', (e) => {
    if (!e.target.closest('#btnCreateSession')) return;

    // Count existing application cards — anchors only, not the add button
    const existingCount = container.querySelectorAll('a').length;

    if (existingCount >= MAX_APPLICATIONS) {
      showLimitToast();
      return;
    }

    openModal();
  });

  document.getElementById('btnSaveApp').addEventListener('click', () => {
    saveApplication(user, { inputAppName, closeModal, showModalError });
  });
});
