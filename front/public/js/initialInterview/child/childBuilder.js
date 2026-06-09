/* eslint-disable no-undef */

// Builds the request body for each pediatric section.
// Keys are camelCase: that is exactly what the backend entity
// (ChildInterview.validate*) reads from the body.

function val (id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

// Mirrors the adult interview helper (ClinicalInterview._symptom): packs a
// presence (Sí/No) + a description into a single text. The child backend stores
// the string as-is, so we build it here.
//   presence 'Sí' + desc  -> "Sí: <desc>"   (o "Sí" si no hay desc)
//   presence 'No'         -> "No"
//   solo desc             -> "<desc>"
function combineSymptom (presence, desc) {
  if (presence === 'Sí') return desc ? `Sí: ${desc}` : 'Sí';
  if (presence === 'No') return 'No';
  if (desc) return desc;
  return '';
}

function symptomField (cat) {
  return combineSymptom(val(`${cat}Presence`), val(`${cat}Desc`));
}

// 3.1 Antecedentes Heredofamiliares  (backend subStep 2)
function buildHeredofamilial () {
  return {
    neurological:         symptomField('neurological'),
    psychiatric:          symptomField('psychiatric'),
    drugAddictions:       symptomField('drugAddictions'),
    lawConduct:           symptomField('lawConduct'),
    cognitiveDevelopment: symptomField('cognitiveDevelopment'),
    speech:               symptomField('speech'),
  };
}

// Combines the 3 card fields (Edad, Descripción, Consecuencia) into a single
// labeled text, stored in the category's varchar(500) column. Only non-empty parts.
function combinePathology (edad, desc, conseq) {
  const parts = [];
  if (edad)   parts.push(`Edad: ${edad}`);
  if (desc)   parts.push(`Descripción: ${desc}`);
  if (conseq) parts.push(`Consecuencia: ${conseq}`);
  return parts.join(' | ');
}

function pathologyField (cat) {
  return combinePathology(val(`${cat}Edad`), val(`${cat}Desc`), val(`${cat}Conseq`));
}

// 3.2 Antecedentes Patológicos  (backend subStep 3)
function buildPathological () {
  return {
    tbi:          pathologyField('tbi'),
    hospitalized: pathologyField('hospitalized'),
    seizure:      pathologyField('seizure'),
    infectious:   pathologyField('infectious'),
    alergies:     pathologyField('alergies'),
    intoxication: pathologyField('intoxication'),
  };
}

// Returns the body matching the given section.
function buildSection (section) {
  switch (Number(section)) {
    case 2: return buildHeredofamilial();
    case 3: return buildPathological();
    default: return {};
  }
}

window.buildSection = buildSection;
