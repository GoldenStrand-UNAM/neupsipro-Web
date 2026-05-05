class TestApplication {
  constructor (data) {
    this.idApplication = data.id_application;
    this.idUser = data.id_user;
    this.applicationName = data.application_name;
    this.status = this.getStatus(data.status);
    this.createdAt = data.created_at;

    // Raw status number kept for persistence (getStatus returns a string)
    this._rawStatus = data.status ?? 6;
  }

    // Called by the repository after INSERT to attach the generated PK
  setId (id) {
    this.idApplication = id;
  }

  // Validates invariants before persisting — throws if invalid
  validate () {
    if (!this.applicationName || !String(this.applicationName).trim()) {
      throw new Error('application_name is required');
    }
    if (String(this.applicationName).trim().length > 20) {
      throw new Error('application_name must be 20 characters or less');
    }
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
        return 'Completada';
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
module.exports = TestApplication;
