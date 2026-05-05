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
module.exports = TestApplication;
