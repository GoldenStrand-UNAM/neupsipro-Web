const ALLOWED_TESTS = ['all', 'banfe', 'wais', 'rey'];

class ExportTestResultsCsvUseCase {
  constructor(testExportRepository) {
    this.testExportRepository = testExportRepository;
  }

  async execute({ test = 'all' }) {
    const normalizedTest = String(test).toLowerCase().trim();

    if (!ALLOWED_TESTS.includes(normalizedTest)) {
      const error = new Error('Tipo de prueba inválido');
      error.status = 400;
      throw error;
    }

    const exportConfig = {
      all: {
        filename: 'all_test_results.csv',
        fetch: () => this.testExportRepository.fetchAllResults(),
      },
      banfe: {
        filename: 'banfe_results.csv',
        fetch: () => this.testExportRepository.fetchBanfeResults(),
      },
      wais: {
        filename: 'wais_results.csv',
        fetch: () => this.testExportRepository.fetchWaisResults(),
      },
      rey: {
        filename: 'rey_results.csv',
        fetch: () => this.testExportRepository.fetchReyResults(),
      },
    };

    const selectedExport = exportConfig[normalizedTest];
    const rows = await selectedExport.fetch();

    return {
      test: normalizedTest,
      filename: selectedExport.filename,
      rows,
    };
  }
}

module.exports = ExportTestResultsCsvUseCase;