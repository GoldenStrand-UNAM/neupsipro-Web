/* global getStatusStyle, createApplicationCard, createAddSessionCard */
/* global document, window */

//Function for intervention card (when it is disabled or active)
function toggleInterventionCard (canStartIntervention) {
  const statusCard = document.getElementById('statusCard');
  const btnIntervention = document.getElementById('btnIntervention');
  const warningText = document.getElementById('warningText');

  if (!statusCard || !btnIntervention) return;

  if (!canStartIntervention) {
    statusCard.classList.remove('bg-[#002B79]/30');
    statusCard.classList.add('bg-gray-200/30', 'pointer-events-none');

    btnIntervention.classList.remove('bg-[#3350A9]');
    btnIntervention.classList.add('bg-gray-400');
    btnIntervention.disabled = true;

    if (warningText) warningText.classList.remove('hidden');
  } else {
    statusCard.classList.remove('bg-gray-200/30', 'pointer-events-none');
    statusCard.classList.add('bg-[#002B79]/30');

    btnIntervention.classList.add('bg-[#3350A9]');
    btnIntervention.classList.remove('bg-gray-400');
    btnIntervention.disabled = false;

    if (warningText) warningText.classList.add('hidden');
  }
}

// funtion to show appointment date in the correct format
function formatAppointmentDate (dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  });
}

// color mapping
function getStatusBadge (val) {
  const statusMap = new Map([
    ['Discharged', { label: 'Alta', border: '#E03232', text: '#E03232', bg: 'rgba(224,50,50,0.33)' }],
    ['Stand_by', { label: 'Stand By', border: '#1560BD', text: '#1560BD', bg: 'rgba(21, 96, 189, 0.33)' }],
    ['Active', { label: 'Activo', border: '#1F893A', text: '#1F893A', bg: 'rgba(31,137,58,0.33)' }],
    ['Declined', { label: 'No ingresó', border: '#95A5A6', text: '#7F8C8D', bg: 'rgba(149, 165, 166,0.33)' }],
  ]);

  const m = statusMap.get(val);
  if (!m) return '<span class="text-gray-300 text-xl"> - </span>';
  return `<span class="btn-badge" style="border-color:${m.border}; color:${m.text}; background-color:${m.bg};">${m.label}</span>`;
}

// parameters as objects
function setStatus ({ textId, cardId, tagId, iconId, status }) {
  const value = status || 'N/A';
  document.getElementById(textId).textContent = value;

  const colors = getStatusStyle(value);

  const card = document.getElementById(cardId);
  if (card) card.classList.add(colors.card);

  const tag = document.getElementById(tagId);
  if (tag) tag.classList.add(colors.tag);

  const icon = document.getElementById(iconId);
  if (icon) icon.innerHTML = colors.icon;
}

// personal data inyection
function populateUserInfo (user) {
  document.getElementById('userName').textContent = user.name || 'Sin nombre';
  document.getElementById('userCode').textContent = user.referenceNumber || 'N/A';
  document.getElementById('userAge').textContent = user.age || 'N/A';
  document.getElementById('userDate').textContent = user.registrationDate
    ? new Date(user.registrationDate).toLocaleDateString() : 'N/A';
  document.getElementById('userPhase').textContent = user.phase || 'N/A';
  document.getElementById('groupIntervention').textContent = user.groupIntervention || 'N/A';
  document.getElementById('etiology').textContent = user.amputationEtiology || 'N/A';

  document.getElementById('prosthetist').textContent = user.prosthetist || 'N/A';
  document.getElementById('neuroDate').textContent = user.neuroEntryDate || 'N/A';

  document.getElementById('amputationDate').textContent = user.amputationDate || 'N/A';

  document.getElementById('amputationLevel').textContent = user.amputationLevel || 'N/A';
  document.getElementById('laterality').textContent = user.laterality || 'N/A';

  document.getElementById('state').innerHTML = getStatusBadge(user.state);
  document.getElementById('nextApt').textContent = user.nextAppointment
    ? formatAppointmentDate(user.nextAppointment.dateTime)
    : 'Sin cita programada';  document.getElementById('protocol').textContent = user.protocol || 'N/A';
  console.log(formatAppointmentDate(user.nextAppointment));
  document.getElementById('clinic').textContent = user.assignedClinic || 'N/A';
}

// Logbook generation
function populateLogbook (user) {
  const container = document.getElementById('logbookContainer');
  if (!container) return;

  container.innerHTML = '';

  if (!user.hasProtocol) {
    container.innerHTML = `
      <div class="col-span-1 md:col-span-3 flex justify-center items-center py-12">
        <p class="text-gray-500 text-xl font-medium">Aún no hay protocolo asignado</p>
      </div>
    `;
  } else {
    if (user.assignedApplications && user.assignedApplications.length > 0) {
      user.assignedApplications.forEach(application => {
        container.innerHTML += createApplicationCard(application, user.idUser);
      });
    }
    container.innerHTML += createAddSessionCard();
  }
}

// Max applications allowed per user
const MAX_APPLICATIONS_UI = 5;

// When the limit is reached, swap the "Nueva aplicación" button for a disabled placeholder.
function enforceApplicationLimit (container) {
  const addBtn = document.getElementById('btnCreateSession');
  if (!addBtn) return;

  const cardCount = container.querySelectorAll('a').length;
  if (cardCount < MAX_APPLICATIONS_UI) return;

  addBtn.outerHTML = `
    <div class="flex flex-col items-center justify-center gap-3 rounded-3xl p-6 w-full border-2 border-dashed border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed select-none">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
      <span class="text-sm font-medium">Límite de 5 alcanzado</span>
    </div>
  `;
}

function setupShowMoreToggle () {
  const btnShowMore = document.getElementById('btnShowMore');
  const textShowMore = document.getElementById('textShowMore');
  const extraFields = document.querySelectorAll('.extra-field');
  const iconMore = document.getElementById('iconMore');
  const iconLess = document.getElementById('iconLess');

  if (!btnShowMore) return;

  let isShowingMore = false;

  btnShowMore.addEventListener('click', () => {
    isShowingMore = !isShowingMore;

    extraFields.forEach(field => {
      if (isShowingMore) {
        field.classList.remove('hidden');
        field.classList.add('flex');
      } else {
        field.classList.add('hidden');
        field.classList.remove('flex');
      }
    });

    if (isShowingMore) {
      textShowMore.textContent = 'Ver menos';
      iconMore.classList.add('hidden');
      iconMore.classList.remove('block');
      iconLess.classList.remove('hidden');
      iconLess.classList.add('block');
    } else {
      textShowMore.textContent = 'Ver más';
      iconLess.classList.add('hidden');
      iconLess.classList.remove('block');
      iconMore.classList.remove('hidden');
      iconMore.classList.add('block');
    }
  });
}

(async function checkApplicationExpiry () {
  const idUser = window.__USER_DATA__?.idUser;
  if (!idUser) return;
  try {
    const res  = await fetch(`/users/${idUser}/applications/check-expiry`);
    const json = await res.json();
    if (!res.ok) { console.error('[checkExpiry]', json.error); return; }
  } catch (err) {
    console.error('[checkExpiry] fetch error:', err);
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const user = window.__USER_DATA__;
  if (!user) return;

  toggleInterventionCard(!!user.canStartIntervention);

  populateUserInfo(user);

  setStatus({
    textId: 'initialInterview',
    cardId: 'initialInterviewCard',
    tagId: 'initialInterviewTag',
    iconId: 'initialInterviewIcon',
    status: user.initialInterview,
  });

  populateLogbook(user);

  const logbook = document.getElementById('logbookContainer');
  if (logbook) {
    enforceApplicationLimit(logbook);
    new MutationObserver(() => enforceApplicationLimit(logbook))
      .observe(logbook, { childList: true });
  }

  setupShowMoreToggle();
});
