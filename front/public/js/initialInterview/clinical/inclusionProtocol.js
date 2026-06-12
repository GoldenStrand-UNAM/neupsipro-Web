// ----------------------------------------------------------------------------
// --------------------- INCLUSION CRITERIA / PROTOCOL DISPLAY ----------------
// Renders the Total/Protocolo summary on the "Criterios de inclusión para
// investigación" section (clinical subStep7). inclusion_total is computed
// and saved whenever a score_* field is saved elsewhere in the interview;
// here we only display the value already stored in DB.

(function () {
  function renderInclusionProtocol (total) {
    const totalEl = document.getElementById('inclusion-total-display');
    const protocolEl = document.getElementById('inclusion-protocol-display');

    if (!totalEl || !protocolEl) return;

    if (total === null || total === undefined || total === '') {
      totalEl.textContent = '--';
      protocolEl.textContent = '--';
      protocolEl.className = '';
      return;
    }

    totalEl.textContent = total;

    if (Number(total) < 7) {
      protocolEl.textContent = 'Clínico';
      protocolEl.className = 'text-blue-600 font-medium';
    } else {
      protocolEl.textContent = 'Investigación';
      protocolEl.className = 'text-green-600 font-medium';
    }
  }

  window.inclusionProtocol = { renderInclusionProtocol };
})();
