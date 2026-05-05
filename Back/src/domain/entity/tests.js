class Tests {
  constructor (data) {
    this.idTest = data.id_test;
    this.testName = data.test_name;
    this.description = data.description;
    this.idResults = data.id_results;
    this.score = data.score;
    this.interpretation = data.interpretation;
    this.dateApplied = data.date_applied;
    this.notes = data.notes;
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

    }
  }
}

module.exports = Tests;
