// API routes
const ENDPOINTS = {
  clincalList: '/dashboardClinical/api',
  dashboard: '/dashboardClinical/api/${encodeURIComponent(ref)',
  userDetail: ref => `/dashboardClinical/api/user/${encodeURIComponent(ref)}`,
};

function clinicalMenu (list) {
  const containerClinical = document.getElementById('selectClinical');
  console.log(list);
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
};
async function loadDashboard () {
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
loadDashboard();
