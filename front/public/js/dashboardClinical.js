/* global escapeHtml, Chart */

// API routes
const ENDPOINTS = {
  clincalList: '/dashboardClinical/api',
  dashboard: ref => `/dashboardClinical/api/${encodeURIComponent(ref)}`,
  userDetail: ref => `/dashboardClinical/api/user/${encodeURIComponent(ref)}`,
};

function cubeHtml (value, label, variant = null) {
  const className = variant ? `cube cube--${variant}` : 'cube';
  return `
    <div class="${className}">
      <span class="cube__value">${escapeHtml(value)}</span>
      <span class="cube__label">${escapeHtml(label)}</span>
    </div>
    `;
}

function renderCubes (items, containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  container.innerHTML = items
    .map(({ value, label, variant }) => cubeHtml(value, label, variant))
    .join('');
}

function renderTopCubes (counts) {
  renderCubes([
    { value: counts.research,       label: 'Protocolo Investigación' },
    { value: counts.clinical,       label: 'Protocolo Clínico' },
    { value: counts.inIntervention, label: 'Intervención' },
    { value: counts.noProtocol,     label: 'Sin Protocolo' },
    { value: counts.standBy,        label: 'Stand by' },
    { value: counts.discharged,     label: 'Alta' },
  ], '#topCubes');
}

function renderBottomCubes (counts) {
  renderCubes([
    { value: counts.research,       label: 'En Protocolo Investigación' },
    { value: counts.clinical,       label: 'En Protocolo Clínico' },
    { value: counts.inIntervention, label: 'En Intervención' },
    { value: counts.noProtocol,     label: 'Sin Protocolo' },
    { value: counts.standBy,        label: 'Stand by' },
    { value: counts.discharged,     label: 'Alta' },
  ], '#bottomCubes');
}

function clinicalMenu (list) {
  const containerClinical = document.getElementById('selectClinical');
  if (!list || !list.length) {
    containerClinical.innerHTML = '<p class="text-gray-500 italic">No hay usuarios en Stand by.</p>';
    return;
  }
  containerClinical.innerHTML = `
    <p class="text-lg font-bold text-gray-700 mb-1 whitespace-pre"> Bienvenido:   </p>
    <select id="standBySelect"
      class="w-48 border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white shadow-sm
      focus:outline-none focus:ring-2 focus:ring-[#3350A9]/30 focus:border-[#3350A9]
      transition-all cursor-pointer">
        ${list.map(ref => `<option value="${escapeHtml(ref.id)}">${escapeHtml(ref.fullName)}</option>`).join('')}
    </select>
  `;
  document.getElementById('selectClinical')
    .addEventListener('change', e => loadDashboard(e.target.value));
  loadDashboard(list[0].id);
}

let flowChartInstance;

function buildFlowChartConfig (labels, values, total) {
  return {
    type: 'polarArea',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: [
          'rgba(51, 80, 169, 0.7)',
          'rgba(92, 124, 250, 0.7)',
          'rgba(66, 165, 245, 0.7)',
          'rgba(255, 193, 7, 0.7)',
          'rgba(31, 137, 58, 0.7)',
          'rgba(224, 50, 50, 0.7)',
        ],
        borderColor: '#fff',
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 14, font: { size: 14 }, padding: 10 } },
        tooltip: {
          callbacks: {
            label: ctx => {
              const value  = ctx.parsed?.r ?? ctx.parsed ?? 0;
              const percentage = total ? Math.round((value / total) * 100) : 0;
              return `${ctx.label}: ${value} (${percentage}%)`;
            },
          },
        },
      },
      scales: {
        r: {
          ticks: { display: false, stepSize: 1 },
          grid: { color: 'rgba(0,0,0,0.06)' },
          angleLines: { color: 'rgba(0,0,0,0.06)' },
        },
      },
    },
  };
}

function renderFlowChart (counts) {
  const labels = ['Investigación', 'Clínico', 'Intervención', 'Sin Protocolo', 'Stand By', 'Alta'];
  const values = [
    counts.research,
    counts.clinical,
    counts.inIntervention,
    counts.noProtocol,
    counts.standBy,
    counts.discharged,
  ];
  const total = values.reduce((a, b) => a + b, 0);
  if (flowChartInstance) flowChartInstance.destroy();
  flowChartInstance = new Chart(
    document.getElementById('flowChart'),
    buildFlowChartConfig(labels, values, total)
  );
}

function initUserInfoPanel (list) {
  const container = document.getElementById('userInfoPanel');
  if (!list || !list.length) {
    container.innerHTML = '<p class="text-gray-500 italic">No tienes usuarios asignados.</p>';
    return;
  }
  container.innerHTML = `
    <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
      <select id="userSelect"
        class="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white shadow-sm
               focus:outline-none focus:ring-2 focus:ring-[#3350A9]/30 focus:border-[#3350A9]
               transition-all cursor-pointer">
        ${list.map(ref => `
          <option value="${escapeHtml(ref.idUser)}">
          ${escapeHtml(ref.firstName)} ${escapeHtml(ref.lastnameP)} ${escapeHtml(ref.lastnameM)}
          </option>`).join('')}
      </select>
    </div>
    <div id="userInfoDetail"></div>
  `;
  document.getElementById('userSelect')
    .addEventListener('change', e => loadUserInfoPanel(e.target.value));
  loadUserInfoPanel(list[0].idUser);
}

function buildAvatarHtml (data) {
  if (data.pp) {
    return `<img
      class="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
      src="${escapeHtml(data.pp)}"
      alt="${escapeHtml(data.fullName)}"
    >`;
  }
  return `<div class="w-12 h-12 rounded-full bg-gray-200 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
    <svg class="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
    </svg>
  </div>`;
}

function buildUserDetailHtml (data, avatarHtml, ageStr, protocolText) {
  return `
    <div class="space-y-2">
      <div class="flex items-center gap-3 pb-2 border-b border-gray-200">
        ${avatarHtml}
        <div class="min-w-0 flex-1">
          <p class="font-bold text-gray-800 truncate">${escapeHtml(data.fullName)}</p>
          <p class="text-xs text-gray-500 mt-0.5">${escapeHtml(ageStr)}</p>
        </div>
        <span class="text-[10px] uppercase tracking-wider font-bold text-[#3350A9] bg-white border border-[#3350A9]/30 rounded px-2 py-0.5">
          ${escapeHtml(data.referenceNumber)}
        </span>
      </div>
      <div class="space-y-0">
        <div class="info-row"><span class="info-row__label">Escolaridad</span><span class="info-row__value">${escapeHtml(data.schooling || 'Sin datos')}</span></div>
        <div class="info-row"><span class="info-row__label">Protocolo</span><span class="info-row__value">${escapeHtml(protocolText)}</span></div>
        <div class="info-row"><span class="info-row__label">Fecha amputación</span><span class="info-row__value">${escapeHtml(data.amputationDate || 'Sin datos')}</span></div>
        <div class="info-row"><span class="info-row__label">Ingreso a NP</span><span class="info-row__value">${escapeHtml(data.neuroEntryDate || 'Sin datos')}</span></div>
        <div class="info-row"><span class="info-row__label">Ingreso a Unidad</span><span class="info-row__value">${escapeHtml(data.unitEntryDate || 'Sin datos')}</span></div>
      </div>
    </div>`;
}

async function loadUserInfoPanel (user) {
  const target = document.getElementById('userInfoDetail');
  target.innerHTML = '<p class="text-gray-400 text-sm">Cargando...</p>';
  try {
    const res  = await fetch(ENDPOINTS.userDetail(user));
    const data = await res.json();
    if (!res.ok) {
      target.innerHTML = `<p class="text-red-500 text-sm">${escapeHtml(data.error || 'Error')}</p>`;
      return;
    }
    const ageStr = data.age
      ? `${data.age.years} años · ${data.age.months} meses · ${data.age.days} días`
      : 'sin datos de edad';
    const protocolMap  = { Clinical: 'Clínico', Research: 'Investigación', Pending: 'Pendiente' };
    const protocolText = protocolMap[data.protocol] || '—';
    target.innerHTML = buildUserDetailHtml(data, buildAvatarHtml(data), ageStr, protocolText);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Network error:', err);
    target.innerHTML = '<p class="text-red-500 text-sm">No se pudo conectar al servidor.</p>';
  }
}

function renderAppointmentBlock (container, list, title) {
  if (!list || !list[0]) {
    container.innerHTML = `<h2 class="text-sm font-bold text-gray-700 mb-3">${title}</h2><p class="text-gray-500 italic">No tienes citas asignadas.</p>`;
    return;
  }
  container.innerHTML = `
    <h2 class="text-base font-bold text-gray-700 mb-3">${title}</h2>
    ${list.map(ref => `
      <p class="relative group text-gray-500 italic hover:-translate-y-0.5">
        ${ref.date} - ${ref.name}
        <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max rounded-md bg-[#E5E8FA] px-2 py-1 text-xs text-gray-500 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
          ${ref.issue}
        </span>
      </p>
    `).join('')}
  `;
}

function loadAppointments (listToday, listTomorrow, listOther) {
  renderAppointmentBlock(document.getElementById('todayAppointments'), listToday, 'Hoy:');
  renderAppointmentBlock(document.getElementById('tomorrowAppointments'), listTomorrow, 'Mañana:');
  renderAppointmentBlock(document.getElementById('otherAppointments'), listOther, 'Próximas:');
}

async function loadDashboard (user) {
  if (!user) return;
  const containerIntroText = document.getElementById('introText');
  const containerHistoricalText = document.getElementById('historicalText');
  try {
    const res = await fetch(ENDPOINTS.dashboard(user));
    const data = await res.json();
    containerIntroText.innerHTML = `
      <div class="mt-4">
        <p class="text-lg font-bold text-gray-700 mb-1"> Asi lucen tus usuarios el día de hoy:</p>
        <p class="text-base font-regular text-gray-700 my-4 mx-1"> Tienes a ${escapeHtml(data.numbers.total)} usuarios, de los cuales:</p>
      </div>
    `;
    containerHistoricalText.innerHTML = `
      <p class="text-base font-regular text-gray-700 mx-1"> Haz trabajado con ${escapeHtml(data.historicalNumbers.total)} usuarios, de los cuales:</p>
    `;
    renderTopCubes(data.numbers);
    renderFlowChart(data.numbers);
    initUserInfoPanel(data.users.usersList);
    loadAppointments(
      data.appointmentsToday.appointmentsList,
      data.appointmentsTomorrow.appointmentsList,
      data.appointmentsOther.appointmentsList
    );
    renderBottomCubes(data.historicalNumbers);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Network error:', err);
    containerIntroText.innerHTML = '<p class="text-red-500 text-sm">No se pudo conectar al servidor.</p>';
  }
}

async function loadFirstView () {
  try {
    const res  = await fetch(ENDPOINTS.clincalList);
    const data = await res.json();
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.error('Server error:', data.error);
      return;
    }
    clinicalMenu(data.clinicals);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Network error:', err);
  }
}

loadFirstView();
