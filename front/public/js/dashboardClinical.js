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
    { value: counts.research,       label: 'En Protocolo Investigación' },
    { value: counts.clinical,       label: 'En Protocolo Clínico' },
    { value: counts.inIntervention, label: 'En Intervención' },
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
    <select id="standBySelect"
      class="w-3/4 border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white shadow-sm
      focus:outline-none focus:ring-2 focus:ring-[#3350A9]/30 focus:border-[#3350A9]
      transition-all cursor-pointer">
        ${list.map(ref => `<option value="${escapeHtml(ref.id)}">${escapeHtml(ref.fullName)}</option>`).join('')}
    </select>
  `;
  document.getElementById('selectClinical')
                .addEventListener('change', e => loadDashboard(e.target.value));

  loadDashboard(list[0].id);
};
let flowChartInstance;

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
  const total  = values.reduce((a, b) => a + b, 0); // Total users for percentages

  if (flowChartInstance) flowChartInstance.destroy(); // Prevent duplicated charts
  flowChartInstance = new Chart(document.getElementById('flowChart'), {
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
      // make the chart adapt to its container size
      responsive: true, maintainAspectRatio: false,
      plugins: {
        // Bottom legend
        legend: { position: 'bottom', labels: { boxWidth: 14, font: { size: 14 }, padding: 10 } },
        // Tooltip with percentage
        tooltip: {
          callbacks: {
            // Customize tooltip text to show both count and percentage
            label: ctx => {
              // Current value of the hovered section
              // Polar charts use ctx.parse.r for the value
              const value  = ctx.parsed?.r ?? ctx.parsed ?? 0; 
              // Calculate percentage based on total
              const percentage = total ? Math.round((value / total) * 100) : 0;

              // Final tooltip text
              return `${ctx.label}: ${value } (${percentage}%)`;
            },
          },
        },
      },
      scales: {
        r: {
          ticks: { display: false, stepSize: 1 },
          grid:  { color: 'rgba(0,0,0,0.06)' },
          angleLines: { color: 'rgba(0,0,0,0.06)' },
        },
      },
    },
  });
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

  // Load selected user detail on change
  document.getElementById('userSelect')
    .addEventListener('change', e => loadUserInfoPanel(e.target.value));

  // By default load the first user and call the function
  loadUserInfoPanel(list[0].idUser);
}

async function loadUserInfoPanel (user) {
  const target = document.getElementById('userInfoDetail');
  target.innerHTML = `<p class="text-gray-400 text-sm">Cargando...</p>`;
  try {
    const res  = await fetch(ENDPOINTS.userDetail(user));
    const data = await res.json();
    //Error handling
    if (!res.ok) {
      target.innerHTML = `<p class="text-red-500 text-sm">${escapeHtml(data.error || 'Error')}</p>`;
      return;
    }
    const ageStr = data.age
      ? `${data.age.years} años · ${data.age.months} meses · ${data.age.days} días`
      : 'sin datos de edad';

    const protocolMap  = { Clinical: 'Clínico', Research: 'Investigación', Pending: 'Pendiente' };
    const protocolText = protocolMap[data.protocol] || '—';

    const avatarHtml = data.photo
      ? `
        <img 
        class="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" 
        src="${escapeHtml(data.photo)}" 
        alt="${escapeHtml(data.fullName)}"
        >
                `
      : `
        <div class="w-12 h-12 rounded-full bg-gray-200 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
        <svg 
          class="w-6 h-6 text-gray-500" 
          fill="currentColor" 
          viewBox="0 0 20 20" 
          xmlns="http://www.w3.org/2000/svg"
        >
        <path 
          fill-rule="evenodd" 
          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" 
          clip-rule="evenodd"
          ></path>
          </svg>
          </div>
        `;
        target.innerHTML = `
                <div class="space-y-2">
                    <!-- Avatar + name -->
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

                    <!-- Info rows -->
                    <div class="space-y-0">
                        <div class="info-row">
                            <span class="info-row__label ">Escolaridad</span>
                            <span class="info-row__value">${escapeHtml(data.schooling || 'Sin datos')}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-row__label">Protocolo</span>
                            <span class="info-row__value">${escapeHtml(protocolText)}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-row__label">Fecha amputación</span>
                            <span class="info-row__value">${escapeHtml(data.amputationDate || 'Sin datos')}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-row__label">Ingreso a NP</span>
                            <span class="info-row__value">${escapeHtml(data.neuroEntryDate || 'Sin datos')}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-row__label">Ingreso a Unidad</span>
                            <span class="info-row__value">${escapeHtml(data.unitEntryDate || 'Sin datos')}</span>
                        </div>
                    </div>
                </div>
            `;

  } catch (err) {
    console.error('Network error:', err);
    target.innerHTML = `<p class="text-red-500 text-sm">No se pudo conectar al servidor.</p>`;
  }
}

function loadAppointments (listToday, listTomorrow, listOther) {
  const todayContainer = document.getElementById('todayAppointments');
  const tomorrowContainer = document.getElementById('tomorrowAppointments');
  const otherContainer = document.getElementById('otherAppointments');
  console.log(listToday);
  if (!listToday || !listToday[0]) {
    todayContainer.innerHTML = '<h2 class="text-sm font-bold text-gray-700 mb-3">Hoy:</h2> <p class="text-gray-500 italic">No tienes citas asignadas.</p>';
  } else {
    todayContainer.innerHTML = `
    <h2 class="text-base font-bold text-gray-700 mb-3">Hoy:</h2>
      ${listToday.map (ref => `
        <p class="text-gray-500 italic"> ${ref.date}  ${ref.name} </p>
        `).join('')}
    `;
  };
  if (!listTomorrow || !listTomorrow[0]) {
    tomorrowContainer.innerHTML = '<h2 class="text-sm font-bold text-gray-700 mb-3">Mañana:</h2> <p class="text-gray-500 italic">No tienes citas asignadas.</p>';
  } else {
    tomorrowContainer.innerHTML = `
    <h2 class="text-base font-bold text-gray-700 mb-3">Mañana:</h2>
      ${listTomorrow.map (ref => `
        <p class="text-regular text-gray-500"> ${ref.date}  ${ref.name} </p>
        `).join('')}
    `;
  };
  if (!listOther || !listOther[0]) {
    otherContainer.innerHTML = '<h2 class="text-sm font-bold text-gray-700 mb-3">Próximas:</h2> <p class="text-gray-500 italic">No tienes citas asignadas.</p>';
  } else {
    otherContainer.innerHTML = `
    <h2 class="text-base font-bold text-gray-700 mb-3">Próximas:</h2>
      ${listOther.map (ref => `
        <p class="text-gray-500 italic"> ${ref.date}  ${ref.name} </p>
        `).join('')}
    `;
  };

}

async function loadDashboard (user) {
  if (!user) {
    return;
  }
  try {
    const containerIntroText = document.getElementById('introText');
    const containerHistoricalText = document.getElementById('historicalText');
    const res = await fetch(ENDPOINTS.dashboard(user));
    const data = await res.json();
    containerIntroText.innerHTML = ` 
      <div class= "mt-4">
        <p class="text-lg font-bold text-gray-700 mb-1"> Bienvenido ${escapeHtml(user)}</p>
        <p class="text-lg font-bold text-gray-700 mb-1"> Asi lucen tus usuarios el día de hoy:</p>
        <p class="text-base font-regular text-gray-700 mb-4"> Tienes a ${escapeHtml(data.numbers.total)} usuarios, de los cuales:</p>
      </div>
    `;
    containerHistoricalText.innerHTML = ` 
        <p class="text-base font-regular text-gray-700 mx-3"> Haz trabajado con ${escapeHtml(data.historicalNumbers.total)} usuarios, de los cuales:</p>
    `;
    renderTopCubes(data.numbers);
    renderFlowChart(data.numbers);
    initUserInfoPanel(data.users.usersList);
    console.log()
    loadAppointments(
      data.appointmentsToday.appointmentsList,
      data.appointmentsTomorrow.appointmentsList,
      data.appointmentsOther.appointmentsList
    );
    renderBottomCubes(data.historicalNumbers);

  }
  catch (err) {
    console.error('Network error:', err);
    containerIntroText.innerHTML = `<p class="text-red-500 text-sm">No se pudo conectar al servidor.</p>`;
  }
}

async function loadFirstView () {
  try {
    const res  = await fetch(ENDPOINTS.clincalList);
    const data = await res.json();
    if (!res.ok) {
      console.error('Server error:', data.error);
      return;
    }
    clinicalMenu(data.clinicals);
  } catch (err) {
    console.error('Network error:', err);
  }
}
loadFirstView();
