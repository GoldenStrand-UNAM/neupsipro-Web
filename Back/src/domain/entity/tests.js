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
        return 'En proceso de Aplicación';
      case 2:
        return 'En proceso de Calificar';
      case 3:
        return 'Elaborado';
      case 4:
        return 'Avanzado';
      case 5:
        return 'Impreso';
      case 6:
        return 'Por Comenzar';
      case 7:
        return 'Calificado';
      case 8:
        return 'Entregado';
      case 9:
        return 'Caducada';
    }
  }
}

module.exports = Tests;
