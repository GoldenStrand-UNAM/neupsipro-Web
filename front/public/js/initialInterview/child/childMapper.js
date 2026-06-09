/* eslint-disable no-undef */

// Renders the data of each pediatric section into its inputs.
// `info` is the section object returned by the API (data.data.section),
// whose keys are snake_case (the DB columns).

function setVal (id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value ?? '';
}

// Inverse of childBuilder.combineSymptom: takes the stored text and splits it
// back into presence (Sí/No) + description, same convention as the adult interview.
function parseSymptom (value) {
  const v = (value || '').trim();
  if (v === '') return { presence: '', desc: '' };
  if (v === 'No') return { presence: 'No', desc: '' };
  if (v === 'Sí') return { presence: 'Sí', desc: '' };
  if (v.startsWith('Sí:')) return { presence: 'Sí', desc: v.slice(3).trim() };
  return { presence: '', desc: v };
}

// 3.1 Antecedentes Heredofamiliares  (backend subStep 2)
function renderHeredofamilialData (info) {
  // camelCase del form  ->  columna snake_case en BD
  const map = {
    neurological:         'neurological',
    psychiatric:          'psychiatric',
    drugAddictions:       'drug_addictions',
    lawConduct:           'law_conduct',
    cognitiveDevelopment: 'cognitive_development',
    speech:               'speech',
  };

  Object.entries(map).forEach(([cat, col]) => {
    const { presence, desc } = parseSymptom(info[col]);
    setVal(`${cat}Presence`, presence);
    setVal(`${cat}Desc`, desc);
  });
}

// Inverse of childBuilder.combinePathology: extracts each labeled part back into
// its card field. (Stopgap; el dato vive todo en una columna varchar(500).)
function parsePathology (value) {
  const v = value || '';
  const grab = (label) => {
    const m = v.match(new RegExp(`${label}:\\s*([^|]*)`));
    return m ? m[1].trim() : '';
  };
  return { edad: grab('Edad'), desc: grab('Descripción'), conseq: grab('Consecuencia') };
}

// 3.2 Antecedentes Patológicos  (backend subStep 3)
function renderPathologicalData (info) {
  const cols = ['tbi', 'hospitalized', 'seizure', 'infectious', 'alergies', 'intoxication'];
  cols.forEach((col) => {
    const { edad, desc, conseq } = parsePathology(info[col]);
    setVal(`${col}Edad`, edad);
    setVal(`${col}Desc`, desc);
    setVal(`${col}Conseq`, conseq);
  });
}

// Dispatches the rendering according to the loaded section.
function renderPediatricData () {

  const childData = window.childData;
  if (!childData) return;

  const info = childData.data?.section || {};

  switch (Number(childData.current_section)) {
    case 2: renderHeredofamilialData(info); break;
    case 3: renderPathologicalData(info); break;
    default: break;
  }
}

window.renderPediatricData = renderPediatricData;
