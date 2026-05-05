/*
    Data structure used to pass data across the boundaries of
    the application without exposing internal business logic
*/

class ApplicationDTO {
  constructor ({ id_application, id_user, application_name, status, created_at }) {
    this.id_application   = id_application;
    this.id_user          = id_user;
    this.application_name = application_name;
    this.status           = status;
    this.created_at       = created_at;
  }
}

module.exports = ApplicationDTO;