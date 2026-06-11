document.addEventListener('DOMContentLoaded', () => {
  const btnSave = document.getElementById('btn-save-permissions');

  if (btnSave) {
    btnSave.addEventListener('click', async () => {
      const saveIcon = document.getElementById('save-icon');
      const saveText = document.getElementById('save-text');

      btnSave.disabled = true;
      btnSave.classList.add('opacity-70', 'cursor-not-allowed');
      saveText.textContent = 'Cargando...';
      saveIcon.innerHTML = `
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            `;

      const userId = btnSave.getAttribute('data-user-id');
      const checkboxes = document.querySelectorAll('.permission-checkbox');
      const permissionsData = {};

      checkboxes.forEach(cb => {
        const moduleId = cb.getAttribute('data-module-id');
        const action = cb.getAttribute('data-action');
        const isChecked = cb.checked;

        if (!permissionsData[moduleId]) {
          permissionsData[moduleId] = {};
        }
        permissionsData[moduleId][action] = isChecked;
      });

      try {
        const res = await fetch(`/clinical/${userId}/permissions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ permissions: permissionsData }),
        });

        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          showToast(json.error || 'No se pudieron guardar los permisos');
          return;
        }

        showToast('Cambios guardados correctamente');

        // setTimeout(() => window.location.reload(), 1500);

      } catch (error) {
        console.error('Error de red:', error);
        showToast('Error de conexión con el servidor');
      } finally {
        btnSave.disabled = false;
        btnSave.classList.remove('opacity-70', 'cursor-not-allowed');
        saveText.textContent = 'Guardar';
        saveIcon.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" stroke-width="1.5" d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3zM15 4v5H6V4m6 14a3 3 0 1 1 0-6a3 3 0 0 1 0 6z"/>
                    </svg>
                `;
      }
    });
  }
});
