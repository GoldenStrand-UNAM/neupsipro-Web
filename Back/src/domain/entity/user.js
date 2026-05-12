class User {
  constructor (data) {
    this.idUser = data.id_user;
    this.photo = data.profile_photo;
    this.referenceNumber = data.reference_number;
    this.name = [data.first_name, data.lastname_p, data.lastname_m]
      .filter(Boolean)
      .join(' ');
    this.age = this.calculateAge(data.birthdate);
    this.registrationDate = data.registration_date;
    this.phase = data.neuro_status;
    this.assignedClinic = data.assigned_clinic;
    this.modality = data.modality;
    this.attendance = data.attendance;
    this.amputationDate = data.amputation_date;
    this.state = data.state;
    this.amputationEtiology = data.amputation_etiology;
    this.prosthetist = data.prosthetist;
    this.neuroEntryDate = data.neuro_entry_date;
    this.amputationLevel = data.amputation_level;
    this.nextAppointment = data.next_appointment;
    this.laterality = this.setLaterality(data.laterality);
    this.groupIntervention = this.getGroupIntervention(data.group_intervention);
    this.initialInterview = this.getStatus(data.initial_interview);
    this.protocol = this.setProtocol(data.protocol);
  }

  calculateAge (birthdate) {
    if (!birthdate) return null;
    const today = new Date();
    const birth = new Date(birthdate);
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();
    if (days < 0) {
      months--;
      const daysInPreviousMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        0
      ).getDate();
      days += daysInPreviousMonth;
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    return `${years} años, ${months} meses y ${days} días`;
  }

  getStatus (status) {
    if (!status) return null;

    switch (status) {
      case 1:
        return 'Por comenzar';
      case 2:
        return 'En proceso';
      case 3:
        return 'Terminada';
    }
  }

  getGroupIntervention (status) {
    if (status === null || status === undefined) return null;
    switch (status) {
      case 0:
        return 'No asiste';
      case 1:
        return 'Sí asiste';
    }
  }

  setLaterality (laterality) {
    if (!laterality) {
      return null;
    }
    if (laterality === 'right') {
      return 'Diestra';
    }
    if (laterality === 'left') {
      return 'Zurda';
    }
    if (laterality === 'both')
      return 'Ambidiestra';
  }

  setProtocol (protocol) {
    if (!protocol) {
      return null;
    }
    if (protocol === 'Clinical' || protocol === 'clinical') {
      return 'Clínico';
    }
    if (protocol === 'Research' || protocol === 'research') {
      return 'Investigación';
    }
  }
}

module.exports = User;
