/* eslint-disable no-undef */
/* eslint-disable max-lines-per-function */
document.addEventListener('DOMContentLoaded', () => {
  // --- Blocking write, edit & eliminate if there is no consult
  const allRows = document.querySelectorAll('.table-permissions-row');

  allRows.forEach(row => {
    const chkConsult = row.querySelector('.chk-consult');
    const chkWrite = row.querySelector('.chk-write');
    const chkEdit = row.querySelector('.chk-editar');
    const chkEliminate = row.querySelector('.chk-eliminar');

    if (!chkConsult || !chkWrite || !chkEdit || !chkEliminate) return;

    const syncPermissions = () => {
      if (!chkConsult.checked) {
        chkWrite.checked = false;
        chkEdit.checked = false;
        chkEliminate.checked = false;

        chkWrite.disabled = true;
        chkEdit.disabled = true;
        chkEliminate.disabled = true;
      } else {
        chkWrite.disabled = false;
        chkEdit.disabled = false;
        chkEliminate.disabled = false;
      }
    };

    syncPermissions();

    chkConsult.addEventListener('change', syncPermissions);
  });
  // ----------------------------------------------------
  const btnSave = document.getElementById('btn-save-permissions');

  if (btnSave) {
    btnSave.addEventListener('click', async () => {
      const saveIcon = document.getElementById('save-icon');
      const saveText = document.getElementById('save-text');
      const rows = document.querySelectorAll('.table-permissions-row');
      const permissionsData = {};

      rows.forEach(row => {
        const moduleId = row.getAttribute('data-module-id');
        const chkConsult = row.querySelector('.chk-consult');
        const chkWrite = row.querySelector('.chk-write');
        const chkEdit = row.querySelector('.chk-editar');
        const chkEliminate = row.querySelector('.chk-eliminar');

        if (!chkConsult || !chkWrite || !chkEdit || !chkEliminate) return;

        const hasChanged =
          (chkConsult.checked !== chkConsult.defaultChecked) ||
          (chkWrite.checked !== chkWrite.defaultChecked) ||
          (chkEdit.checked !== chkEdit.defaultChecked) ||
          (chkEliminate.checked !== chkEliminate.defaultChecked);

        if (hasChanged) {
          permissionsData[moduleId] = {
            ver: chkConsult.checked,
            crear: chkWrite.checked,
            editar: chkEdit.checked,
            eliminar: chkEliminate.checked,
          };
        }
      });

      if (Object.keys(permissionsData).length === 0) {
        showToast('No has realizado ninguna modificación.', 'info');
        return;
      }

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

      try {
        const res = await fetch(`/api/admin/clinical/${userId}/permissions`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ permissions: permissionsData }),
        });

        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          showToast(json.error || 'No se pudieron guardar los permisos', 'error');
          return;
        }

        showToast('Cambios guardados correctamente', 'success');

        setTimeout(() => window.location.reload(), 1500);

      } catch (error) {
        showToast('Error de conexión con el servidor', 'error');
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
