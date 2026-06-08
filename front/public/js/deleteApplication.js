/* global _csrfToken */

let _pendingDeleteId = null;

function openDeleteApplicationModal (idApplication) {
  _pendingDeleteId = idApplication;
  document.getElementById('deleteApplicationModal').classList.remove('hidden');
}

function closeDeleteApplicationModal () {
  _pendingDeleteId = null;
  document.getElementById('deleteApplicationModal').classList.add('hidden');
}

function showDeleteToast (message, success = true) {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-6 right-6 z-50 flex items-center gap-3 ${success ? 'bg-[#002B7A]' : 'bg-red-600'} text-white px-5 py-3 rounded-xl shadow-lg text-sm`;
  toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
         stroke-width="2" stroke="currentColor" class="w-5 h-5 shrink-0">
      <path stroke-linecap="round" stroke-linejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
    </svg>
    <span>${message}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  const user = window.__USER_DATA__;
  if (!user) return;

  document.getElementById('cancelDeleteApplication')
    .addEventListener('click', closeDeleteApplicationModal);

  document.getElementById('deleteApplicationModal')
    .addEventListener('click', (e) => {
      if (e.target === document.getElementById('deleteApplicationModal')) {
        closeDeleteApplicationModal();
      }
    });

  document.getElementById('confirmDeleteApplication')
    .addEventListener('click', async () => {
      if (!_pendingDeleteId) return;

      const idApplication = _pendingDeleteId;
      closeDeleteApplicationModal();

      try {
        const res = await fetch(
          `/users/${user.idUser}/applications/${idApplication}`,
          {
            method: 'DELETE',
            headers: { 'x-csrf-token': _csrfToken },
          }
        );
        const json = await res.json();

        if (!res.ok) {
          showDeleteToast(json.error || 'Error al eliminar la aplicación', false);
          return;
        }

        const card = document.querySelector(`[data-id-application="${idApplication}"]`);
        if (card) card.remove();

        showDeleteToast('Aplicación eliminada con éxito');

      } catch {
        showDeleteToast('Error de red, intenta de nuevo', false);
      }
    });
});
