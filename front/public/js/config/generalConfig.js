/* global _csrfToken */

const generalConfigModal = document.getElementById('generalConfigModal');
const openGeneralConfigBtn = document.getElementById('openGeneralConfigModal');
const cancelGeneralConfigBtn = document.getElementById('cancelGeneralConfig');
const saveGeneralConfigBtn = document.getElementById('saveGeneralConfig');
const minSalaryInput = document.getElementById('minSalaryInput');
const generalConfigMessage = document.getElementById('generalConfigMessage');

function showConfigMessage (message, isError) {
  generalConfigMessage.textContent = message;
  generalConfigMessage.classList.remove('hidden', 'text-green-600', 'text-red-600');
  generalConfigMessage.classList.add(isError ? 'text-red-600' : 'text-green-600');
}

async function safeJson (res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

async function loadMinSalary () {
  try {
    const res = await fetch('/api/config/min-salary');

    if (!res.ok) {
      showConfigMessage('No se pudo obtener el salario mínimo actual', true);
      return;
    }

    const data = await safeJson(res);
    minSalaryInput.value = data?.minSalary ?? '';
  } catch {
    showConfigMessage('Error de conexión con el servidor', true);
  }
}

openGeneralConfigBtn.addEventListener('click', () => {
  generalConfigModal.classList.remove('hidden');
  generalConfigMessage.classList.add('hidden');
  loadMinSalary();
});

cancelGeneralConfigBtn.addEventListener('click', () => {
  generalConfigModal.classList.add('hidden');
});

saveGeneralConfigBtn.addEventListener('click', async () => {
  try {
    const res = await fetch('/api/config/min-salary', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': _csrfToken,
      },
      body: JSON.stringify({ minSalary: Number(minSalaryInput.value) }),
    });

    if (!res.ok) {
      const errorData = await safeJson(res);
      showConfigMessage(errorData?.error || 'No se pudo guardar el salario mínimo', true);
      return;
    }

    const data = await safeJson(res);
    minSalaryInput.value = data?.minSalary ?? minSalaryInput.value;
    showConfigMessage('Salario mínimo actualizado correctamente', false);
  } catch {
    showConfigMessage('Error de conexión con el servidor', true);
  }
});
