// Maps the protocol stored in the DB to the label shown in the report.
const PROTOCOL_LABELS = {
  Research: 'Investigación',
  Clinical: 'Clínico',
  Pending: 'Pendiente',
};

const STATUS_GRADED = 3;
const STATUS_DELIVERED = 4;

// Formats a date value as dd/mm/yyyy (es-MX). Returns '—' when empty.
function formatDate (value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Whole years between a birthdate and today as a number. Returns null when invalid.
// Birthdates are stored as dd/mm/yyyy strings, which new Date() misparses, so we
// split that format explicitly (same approach as the dashboard DTOs).
function ageInYears (birthdate) {
  if (!birthdate) return null;
  let dob;
  if (typeof birthdate === 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(birthdate)) {
    const [day, month, year] = birthdate.split('/').map(Number);
    dob = new Date(year, month - 1, day);
  } else {
    dob = new Date(birthdate);
  }
  if (Number.isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;
  return age >= 0 ? age : null;
}

// Chronological age formatted for the report. Returns '' when invalid.
function calculateAge (birthdate) {
  const age = ageInYears(birthdate);
  return age == null ? '' : `${age} años`;
}

// Mental Age (EM) = (CI x Chronological Age) / 100. Needs the WAIS total IQ (CI).
// Returns '' when either input is missing/invalid.
function calculateMentalAge (ci, chronoYears) {
  // ci is null/empty when WAIS was not applied (e.g. clinical protocol) -> no Mental Age.
  if (ci == null || ci === '' || chronoYears == null) return '';
  const ciNum = Number(ci);
  if (!Number.isFinite(ciNum)) return '';
  const em = Math.round((ciNum * chronoYears) / 10) / 10; // one decimal
  return `${em} años`;
}

// Builds and returns the export PDF for a completed application.
// Reuses the existing get*UseCase to map each test result to its DTO.
// Supports both Research (BANFE/WAIS/REY) and Clinical (MOCA/NIH) protocols.
class ExportPdfUseCase {
  constructor (testResultsRepository, usersRepository, pdfService, getBanfeUseCase, getWaisUseCase, getReyUseCase, getMocaUseCase = null, getNihUseCase = null, getEmotionUseCase = null) {
    this.testResultsRepository = testResultsRepository;
    this.usersRepository = usersRepository;
    this.pdfService = pdfService;
    this.getBanfeUseCase = getBanfeUseCase;
    this.getWaisUseCase = getWaisUseCase;
    this.getReyUseCase = getReyUseCase;
    this.getMocaUseCase = getMocaUseCase;
    this.getNihUseCase = getNihUseCase;
    this.getEmotionUseCase = getEmotionUseCase;
  }

  async execute ({ id_user, id_application }) {
    // 1. Validate the application exists and is completed
    const application = await this.testResultsRepository.fetchApplicationById({ id_application });
    if (!application) {
      const err = new Error('Application not found');
      err.status = 404;
      throw err;
    }
    if (application.status !== STATUS_GRADED && application.status !== STATUS_DELIVERED) {
      const err = new Error('Application is not completed');
      err.status = 422;
      throw err;
    }

    // 2. Patient data for the header
    const user = await this.usersRepository.fetchUserForExport({ id_user });
    if (!user) {
      const err = new Error('User not found');
      err.status = 404;
      throw err;
    }

    // 3. Graded results, normalized for the template
    const gradedResults = await this.testResultsRepository.fetchAllResultsForExport({ id_application });
    const results = [];
    let waisCi = null; // WAIS total IQ, used to derive Mental Age
    for (const result of gradedResults) {
      const section = await this.#buildSection(result);
      if (section) {
        results.push(section);
        // WAIS section stores the total IQ in its totalRow as ['CI Total', value, ''].
        if (result.idTest === 2 && section.totalRow) waisCi = section.totalRow[1];
      }
    }

    // 4. Build the report payload
    const chronoYears = ageInYears(user.birthdate);
    // Schooling and occupation come from the user's initial interview.
    const { schooling, ocupation } = await this.testResultsRepository.fetchUserSchoolingAndOccupation({ id_user });
    const report = {
      patientName: user.name,
      referenceNumber: user.referenceNumber ?? '',
      laterality: user.laterality ?? '',
      age: calculateAge(user.birthdate),
      mentalAge: calculateMentalAge(waisCi, chronoYears),
      schooling: schooling ?? '',
      ocupation: ocupation ?? '',
      protocolLabel: PROTOCOL_LABELS[user.protocol] ?? user.protocol,
      applicationName: application.applicationName,
      statusLabel: 'Entregado',
      exportedDate: formatDate(new Date()),
      results,
    };

    // 5. Generate the PDF
    const pdfBuffer = await this.pdfService.generate(report);

    // 6. Mark the application and its tests as delivered
    await this.testResultsRepository.updateApplicationAndTestsStatus({
      id_application,
      status: STATUS_DELIVERED,
    });

    // 7. Filename: Informe_Neuropsicologico_<Usuario>_<Protocolo>_<YYYY-MM-DD>.pdf
    const slug = (value) => String(value ?? '')
      .normalize('NFD').replace(/[̀-ͯ]/g, '') // strip accents
      .replace(/[^\w-]+/g, '_')
      .replace(/^_+|_+$/g, '');
    const stamp = new Date().toISOString().slice(0, 10);
    const filename = `Informe_Neuropsicologico_${slug(user.name)}_${slug(report.protocolLabel)}_${stamp}.pdf`;

    return { pdfBuffer, filename };
  }

  // Normalizes a graded test result into the generic table structure the template expects.
  async #buildSection (result) {
    const dateApplied = formatDate(result.dateApplied);

    if (result.idTest === 1) {
      const dto = await this.getBanfeUseCase.execute({ id_results: result.idResults });
      return {
        testName: 'BANFE',
        dateApplied,
        columns: ['Área', 'Puntuación', 'Interpretación'],
        rows: [
          ['Orbito Frontal', dto.areas.orbitFrontal.score, dto.areas.orbitFrontal.interpretation],
          ['Prefrontal Anterior', dto.areas.prefrontalBefore.score, dto.areas.prefrontalBefore.interpretation],
          ['DorsoLateral', dto.areas.dLateral.score, dto.areas.dLateral.interpretation],
        ],
        totalRow: ['Score Total', dto.scoreTotal, ''],
        notes: dto.notes,
      };
    }

    if (result.idTest === 2) {
      const dto = await this.getWaisUseCase.execute({ id_results: result.idResults });
      return {
        testName: 'WAIS',
        dateApplied,
        columns: ['Área', 'Score', 'Interpretación'],
        rows: [
          ['Comprensión verbal', dto.areas.comVerbal.score, dto.areas.comVerbal.interpretation],
          ['Razonamiento Perceptual', dto.areas.razonPerceptual.score, dto.areas.razonPerceptual.interpretation],
          ['Memoria de trabajo', dto.areas.memWork.score, dto.areas.memWork.interpretation],
          ['Velocidad de procesamiento', dto.areas.veloProce.score, dto.areas.veloProce.interpretation],
        ],
        totalRow: ['CI Total', dto.scoreTotal, ''],
        notes: dto.notes,
      };
    }

    if (result.idTest === 3) {
      const dto = await this.getReyUseCase.execute({ id_results: result.idResults });
      const area = (a) => [a.score, a.pc, a.time, a.pcTime];
      return {
        testName: 'REY',
        dateApplied,
        columns: ['Área', 'Score', 'Pc', 'Tiempo', 'Pc Tiempo'],
        rows: [
          ['R - C', ...area(dto.rc)],
          ['R - MCp', ...area(dto.mcp)],
          ['R - MLp', ...area(dto.mlp)],
        ],
        totalRow: null,
        notes: dto.notes,
      };
    }

    if (result.idTest === 4 && this.getMocaUseCase) {
      const dto = await this.getMocaUseCase.execute({ id_results: result.idResults });
      return {
        testName: 'MOCA',
        dateApplied,
        columns: ['Área', 'Puntuación', 'Interpretación'],
        rows: [
          ['Score Total', dto.score, dto.interpretation],
        ],
        totalRow: null,
        notes: dto.notes,
      };
    }

    if (result.idTest === 5 && this.getNihUseCase) {
      const dto = await this.getNihUseCase.execute({ id_results: result.idResults });
      return {
        testName: 'NIH',
        dateApplied,
        columns: ['Observaciones'],
        rows: [],
        totalRow: null,
        notes: dto.notes,
      };
    }

    if (result.idTest === 6 && this.getEmotionUseCase) {
      const dto = await this.getEmotionUseCase.execute({ id_results: result.idResults });
      return {
        testName: 'Cuestionario Socioemocional',
        dateApplied,
        columns: ['Índice', 'Puntuación', 'Interpretación'],
        rows: [
          ['IAB (Ansiedad - Beck)', dto.scoreAnxietyBeck ?? '—', dto.interAnxietyBeck ?? '—'],
          ['IDB (Depresión - Beck)', dto.scoreDepressionBeck ?? '—', dto.interDepressionBeck ?? '—'],
        ],
        totalRow: null,
        notes: dto.notes,
      };
    }

    return null;
  }
}

module.exports = ExportPdfUseCase;
