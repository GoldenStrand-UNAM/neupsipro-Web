/*
    Data structure used to pass data across the boundaries of
    the application without exposing internal business logic
*/

class ApplicationDTO {
  constructor (entity) {
    this.idApplication   = entity.idApplication;
    this.idUser          = entity.idUser;
    this.applicationName = entity.applicationName;
    this.status          = entity.status;
    this.createdAt       = entity.createdAt;
  }
}

module.exports = ApplicationDTO;