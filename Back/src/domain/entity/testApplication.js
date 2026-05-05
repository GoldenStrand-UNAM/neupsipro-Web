/* 
    Represents the core business object for a test application session.
    Validates its own invariants on construction — no invalid state can exist.
 */

 class TestApplication {
  constructor ({ id_application, id_user, application_name, status, created_at }) {
    this._validate({ application_name });

    this.id_application  = id_application ?? null;
    this.id_user         = id_user;
    this.application_name = application_name.trim ();
    this.status          = status ?? 6;
    this.created_at      = created_at ?? new Date ();
  }

  // Called by the repository after INSERT to attach the generated PK
  setId (id) {
    this.id_application = id;
  }

  // Internal validation
  _validate ({ application_name }) {
    if (!application_name || !application_name.trim()) {
      throw new Error('application_name is required');
    }
    if (application_name.trim().length > 20) {
      throw new Error('application_name must be 20 characters or less');
    }
  }
}

module.exports = TestApplication;
