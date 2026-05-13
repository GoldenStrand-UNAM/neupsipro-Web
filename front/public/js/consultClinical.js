/* eslint-env browser */
/* global getStatusStyle */
/* global document, window */

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

function populateUserInfo (user) {
  document.getElementById('clinicalName').textContent = user.name || 'Sin nombre';
  document.getElementById('activity').textContent = user.activity || 'N/A';
  document.getElementById('affiliation').textContent = user.affiliation || 'N/A';
  document.getElementById('hours').textContent = user.hours || 'N/A';
  document.getElementById('startDate').textContent = user.startDate
    ? new Date(user.startDate).toLocaleDateString() : 'N/A';
  document.getElementById('endDate').textContent = user.endDate
    ? new Date(user.endDate).toLocaleDateString() : 'N/A';;
  document.getElementById('emergencyName').textContent = user.emergencyName || 'N/A';
  document.getElementById('emergencyPhone').textContent = user.emergencyPhone || 'N/A';
  document.getElementById('emergencyRelation').textContent = user.emergencyRelation || 'N/A';
}

document.addEventListener('DOMContentLoaded', () => {
  const user = window.__USER_DATA__;
  if (!user) return;

  populateUserInfo(user);
});
