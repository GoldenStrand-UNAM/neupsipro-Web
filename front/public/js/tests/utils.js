function escapeHTML (str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getVariant (status) {
  const map = new Map([
    ['Por comenzar', 'neutral'],
    ['En proceso', 'warning'],
    ['Calificada', 'success'],
    ['Entregada', 'success'],
    ['Caducada', 'fatal'],
  ]);
  return map.get(status) ?? 'neutral';
}

// eslint-disable-next-line no-unused-vars
function showToast (message) {
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#002B7A] text-white px-5 py-3 rounded-xl shadow-lg text-sm';
  toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
         stroke-width="2" stroke="currentColor" class="w-5 h-5 text-white shrink-0">
      <path stroke-linecap="round" stroke-linejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
    </svg>
    <span>${escapeHTML(message)}</span>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// eslint-disable-next-line no-unused-vars
function removeSkeletons () {
  document.querySelectorAll('.test-card-skeleton').forEach(el => el.remove());
}

// Updates badge, card color, and cached test data after a successful save
// eslint-disable-next-line no-unused-vars
function updateTestCardStatus (dto) {
  const card = document.querySelector(`[data-id-results="${dto.idResults}"]`);
  if (!card) return;

  const badge = card.querySelector('.application-card__badge');
  if (!badge) return;

  // DTO returns numeric status — normalize to display string
  const STATUS_LABEL = {
    1: 'Por comenzar',
    2: 'En proceso',
    3: 'Calificada',
    4: 'Entregado',
    5: 'Caducada',
  };
  const label = typeof dto.status === 'number'
    ? (STATUS_LABEL[dto.status] ?? 'Por comenzar')
    : dto.status;

  const variants = ['neutral', 'warning', 'success', 'fatal'];
  const newVariant = getVariant(label);

  badge.querySelector('p').textContent = label;
  variants.forEach(v => badge.classList.remove(`application-card__badge--${v}`));
  badge.classList.add(`application-card__badge--${newVariant}`);

  variants.forEach(v => card.classList.remove(`application-card--${v}`));
  card.classList.add(`application-card--${newVariant}`);

  if (dto.dateApplied) {
    const dateEl = card.querySelector('.application-card__date');
    if (dateEl) {
      const formatted = new Date(dto.dateApplied).toLocaleDateString('es-MX');
      dateEl.textContent = `Aplicada: ${formatted}`;
    }
  }

  if (card.dataset.test) {
    try {
      const testData = JSON.parse(card.dataset.test);
      testData.status = label;
      if (dto.dateApplied) testData.dateApplied = dto.dateApplied;
      card.dataset.test = JSON.stringify(testData);
    } catch (_) { /* datos corruptos, se ignoran */ }
  }
}
