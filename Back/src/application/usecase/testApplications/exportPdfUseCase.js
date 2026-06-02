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

// Builds and returns the export PDF for a completed application.
// Reuses the existing get*UseCase to map each test result to its DTO.
class ExportPdfUseCase {
  constructor (testResultsRepository, usersRepository, pdfService, getBanfeUseCase, getWaisUseCase, getReyUseCase) {
    this.testResultsRepository = testResultsRepository;
    this.usersRepository = usersRepository;
    this.pdfService = pdfService;
    this.getBanfeUseCase = getBanfeUseCase;
    this.getWaisUseCase = getWaisUseCase;
    this.getReyUseCase = getReyUseCase;
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
    for (const result of gradedResults) {
      const section = await this.#buildSection(result);
      if (section) results.push(section);
    }

    // 4. Build the report payload
    const report = {
      patientName: user.name,
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

    // 7. Filename
    const safeName = String(application.applicationName).replace(/[^\w-]+/g, '_');
    const stamp = new Date().toISOString().slice(0, 10);
    const filename = `reporte_${safeName}_${stamp}.pdf`;

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

    // MOCA / NIH are not part of the research export.
    return null;
  }
}

module.exports = ExportPdfUseCase;
