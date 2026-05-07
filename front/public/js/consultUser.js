document.addEventListener('DOMContentLoaded', () => {
  const user = window.__USER_DATA__;
  if (!user) {
    console.warn('No se recibió ningún usuario del servidor');
    return;
  }

  const canStartIntervention = user.canStartIntervention !== undefined
    ? user.canStartIntervention
    : (user.assignedApplications && user.assignedApplications.some(a => a.applicationName === 'Sesión inicial' && a.status === 'Entregado'));

  if (!canStartIntervention) {
    const interventionCard = document.getElementById('statusCard');
    const btnIntervention = document.getElementById('btnIntervention');

    if (interventionCard && btnIntervention) {
      interventionCard.classList.add('opacity-50', 'pointer-events-none');

      interventionCard.classList.add('grayscale');

      btnIntervention.classList.remove('bg-[#3350A9]');
      btnIntervention.classList.add('bg-gray-400');
      btnIntervention.disabled = true;
    }
  }

  // Personal Info
  document.getElementById('userName').textContent =
                user.name || 'Sin nombre';

  document.getElementById('userCode').textContent =
                user.referenceNumber || 'N/A';

  // First Column
  document.getElementById('userAge').textContent =
                user.age || 'N/A';

  document.getElementById('userDate').textContent =
                user.registrationDate
                  ? new Date(user.registrationDate).toLocaleDateString()
                  : 'N/A';

  document.getElementById('userPhase').textContent =
                user.phase || 'N/A';

  document.getElementById('groupIntervention').textContent =
                user.groupIntervention || 'N/A';

  document.getElementById('etiology').textContent =
                user.amputationEtiology || 'N/A';

  // Second Column
  document.getElementById('prosthetist').textContent =
                user.prosthetist || 'N/A';

  document.getElementById('neuroDate').textContent =
                user.neuroEntryDate
                  ? new Date(user.neuroEntryDate).toLocaleDateString()
                  : 'N/A';

  document.getElementById('amputationDate').textContent =
                user.amputationDate
                  ? new Date(user.amputationDate).toLocaleDateString()
                  : 'N/A';

  document.getElementById('amputationLevel').textContent =
                user.amputationLevel || 'N/A';

  document.getElementById('laterality').textContent =
                user.laterality || 'N/A';

  document.getElementById('state').innerHTML = getStatusBadge(user.state);

  document.getElementById('nextApt').textContent =
                formatAppointmentDate(user.nextAppointment) || 'N/A';

  document.getElementById('protocol').textContent =
                user.protocol || 'N/A';

  document.getElementById('clinic').textContent =
                user.assignedClinic || 'N/A';

  function setStatus (textId, cardId, tagId, iconId, status) {
    const value = status || 'N/A';

    document.getElementById(textId).textContent = value;

    const colors = getStatusStyle(value);

    // card
    const card = document.getElementById(cardId);
    if (card) card.classList.add(colors.card);

    // tag
    const tag = document.getElementById(tagId);
    if (tag) tag.classList.add(colors.tag);

    // icon
    const icon = document.getElementById(iconId);
    if (icon) icon.innerHTML = colors.icon;
  }

  function getStatusBadge (val) {
    const map = {
      'Discharged': { label: 'Alta', border: '#E03232', text: '#E03232', bg: 'rgba(224,50,50,0.33)' },
      'Stand_by': { label: 'Stand By', border: '#1560BD', text: '#1560BD', bg: 'rgba(21, 96, 189, 0.33)' },
      'Active': { label: 'Activo', border: '#1F893A', text: '#1F893A', bg: 'rgba(31,137,58,0.33)' },
      'Declined': { label: 'No ingresó',border: '#95A5A6', text: '#7F8C8D', bg: 'rgba(149, 165, 166,0.33)' },
    };
    const m = map[val];
    if (!m) return '<span class="text-gray-300 text-xl"> - </span>';
    return `<span class="btn-badge" style="border-color:${m.border}; color:${m.text}; background-color:${m.bg};">${m.label}</span>`;
  }

  function formatAppointmentDate (dateString) {
    const date = new Date(dateString);

    return date.toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  // Using function
  setStatus(
    'initialInterview',
    'initialInterviewCard',
    'initialInterviewTag',
    'initialInterviewIcon',
    user.initialInterview
  );

  const container = document.getElementById('logbookContainer');
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
        const cardHTML = createApplicationCard(application);
        container.innerHTML += cardHTML;
      });
    }
    container.innerHTML += createAddSessionCard();
  }

  //SHOW MORE
  const btnShowMore = document.getElementById('btnShowMore');
  const textShowMore = document.getElementById('textShowMore');
  const extraFields = document.querySelectorAll('.extra-field');
  const iconMore = document.getElementById('iconMore');
  const iconLess = document.getElementById('iconLess');

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
});
