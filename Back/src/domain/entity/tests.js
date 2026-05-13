class Tests {
  constructor (data) {
    this.idTest = data.id_test;
    this.idApplication = data.id_application;
    this.idResults = data.id_results;
    this.testName = data.test_name;
    this.resultTable    = data.result_table; 
    this.dateApplied = data.date_applied;
    this.status = this.getStatus(data.status);
  }

  getStatus (status) {
    if (!status) return null;

    switch (status) {
      case 1:
        return 'Por comenzar';
      case 2:
        return 'En proceso';
      case 3:
        return 'Calificada';
      case 4:
        return 'Entregado';
      case 5:
        return 'Caducada';

    }
  }
}

module.exports = Tests;
