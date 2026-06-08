
class IdentificationInterview {
  constructor ({ id_user, current_step, current_section, initialProgress, readOnlyFields, data }) {
    this.id_user = id_user;
    this.current_step = current_step;
    this.current_section = current_section;

    switch (current_section) {
      case 1:
        this.data = this.mapSubStep1(initialProgress, readOnlyFields, data);
        break;

      default:
        throw new Error('Invalid section');
    }
  }

  // ----- Auxiliary functions ------------------------------------------------

  static MAX_TEXT_LENGTH = 30;

  static SCHOOLING_OPTIONS = [
    'Sin escolaridad',
    'Primaria',
    'Secundaria',
    'Bachillerato',
    'Licenciatura',
    'Posgrado',
  ];

  // Get number or null if the value isn't registered
  static numberOrNull (value) {
    return value === null ||
    value === undefined ||
    value === ''
      ? null
      : Number(value);
  }

  // Get text or null if the value isn't registered, throws if it exceeds maxLength
  static textOrNull (value, maxLength = IdentificationInterview.MAX_TEXT_LENGTH) {
    if (value === null || value === undefined || value === '') return null;

    const text = String(value);
    if (text.length > maxLength) throw new Error(`El texto no puede superar ${maxLength} caracteres`);

    return text;
  }

  // Required text field, throws if empty or too long
  static requiredText (value, maxLength, label) {
    if (value === null || value === undefined || String(value).trim() === '') {
      throw new Error(`${label} es obligatorio`);
    }

    const text = String(value).trim();
    if (text.length > maxLength) throw new Error(`${label} no puede superar ${maxLength} caracteres`);

    return text;
  }

  // Date field (AAAA-MM-DD): accepts Date instances (from DB) or ISO strings (from frontend)
  static dateOrNull (value) {
    if (value === null || value === undefined || value === '') return null;

    if (value instanceof Date) {
      if (isNaN(value.getTime())) return null;
      return value.toISOString().slice(0, 10);
    }

    const text = String(value).trim();
    if (!/^\d{4}-\d{2}-\d{2}/.test(text)) throw new Error('La fecha debe tener el formato AAAA-MM-DD');

    return text.slice(0, 10);
  }

  // Number within [min, max], rounded to 1 decimal, or null if empty
  static numberRangeOrNull (value, min, max, label) {
    if (value === null || value === undefined || value === '') return null;

    const num = Number(value);
    if (isNaN(num)) return null;
    if (num < min || num > max) throw new Error(`${label} debe estar entre ${min} y ${max}`);

    return Math.round(num * 10) / 10;
  }

  // Validate against an allowed list of options, or null if empty
  static enumOrNull (value, options) {
    if (value === null || value === undefined || value === '') return null;

    if (!options.includes(value)) {
      throw new Error(`Elige una opción disponible: ${options.join(', ')}`);
    }

    return value;
  }

  // ================================= Map =================================

  // Datos Personales
  mapSubStep1 (initialProgress, readOnlyFields, data) {
    const base = data || {};
    const readOnly = readOnlyFields || {};

    return {
      readOnly: {
        referenceNumber: IdentificationInterview.textOrNull(readOnly.reference_number, 78),
        fullName: IdentificationInterview.textOrNull(readOnly.full_name, 354),
        email: IdentificationInterview.textOrNull(readOnly.email, 158),
        phone: IdentificationInterview.textOrNull(readOnly.phone, 118),
        birthdate: IdentificationInterview.textOrNull(readOnly.birthdate, 78),
        age: IdentificationInterview.numberOrNull(readOnly.age),
        laterality: IdentificationInterview.textOrNull(readOnly.laterality, 80),
        isChild: Boolean(readOnly.is_child),
      },

      personalData: {
        interviewDate: IdentificationInterview.dateOrNull(base.interview_date),
        interviewerName: IdentificationInterview.textOrNull(base.interviewer_name, 80),
        supportStudentName: IdentificationInterview.textOrNull(base.support_student_name, 80),
        companionsName: IdentificationInterview.textOrNull(base.companions_name, 50),
        companionRelation: IdentificationInterview.textOrNull(base.companion_relation, 50),
        address: IdentificationInterview.textOrNull(base.address, 100),
        proofAddress: IdentificationInterview.textOrNull(base.proof_address, 200),
        healthcareSystem: IdentificationInterview.textOrNull(base.healthcare_system, 50),
        religion: IdentificationInterview.textOrNull(base.religion, 30),
        weight: IdentificationInterview.numberOrNull(base.weight),
        size: IdentificationInterview.numberOrNull(base.size),
        imc: IdentificationInterview.numberOrNull(base.imc),
        imcCategory: IdentificationInterview.textOrNull(base.imc_category, 30),
        schooling: IdentificationInterview.textOrNull(base.schooling, 30),
        residence: IdentificationInterview.textOrNull(base.residence, 80),
        fathersSchooling: IdentificationInterview.textOrNull(base.fathers_schooling, 30),
        mothersSchooling: IdentificationInterview.textOrNull(base.mothers_schooling, 30),
        ocupation: IdentificationInterview.textOrNull(base.ocupation, 50),
      },

      completedSteps: this.mapInitialProgress(initialProgress),

      id_user: this.id_user,
    };
  }

  // Initial Interview Progress
  mapInitialProgress (initialProgress) {
    const data = initialProgress[0];

    const completedSteps = [];

    if (data.identification_completed) completedSteps.push(1);
    if (data.financial_completed) completedSteps.push(2);
    if (data.symptoms_completed) completedSteps.push(3);

    return completedSteps;
  }

  // ============================= VALIDATIONS =============================

  // Validate Datos Personales
  static validateSubStep1 (data) {
    return {
      interviewDate: this.dateOrNull(data.interviewDate),
      interviewerName: this.textOrNull(data.interviewerName, 80),
      supportStudentName: this.textOrNull(data.supportStudentName, 80),
      companionsName: this.textOrNull(data.companionsName, 50),
      companionRelation: this.textOrNull(data.companionRelation, 50),
      address: this.textOrNull(data.address, 100),
      proofAddress: this.textOrNull(data.proofAddress, 200),
      healthcareSystem: this.textOrNull(data.healthcareSystem, 50),
      religion: this.textOrNull(data.religion, 30),
      weight: this.numberRangeOrNull(data.weight, 0, 620, 'El peso'),
      size: this.numberRangeOrNull(data.size, 0, 251, 'La talla'),
      imc: this.numberOrNull(data.imc),
      imcCategory: this.textOrNull(data.imcCategory, 30),
      schooling: this.enumOrNull(data.schooling, this.SCHOOLING_OPTIONS),
      residence: this.textOrNull(data.residence, 80),
      fathersSchooling: this.enumOrNull(data.fathersSchooling, this.SCHOOLING_OPTIONS),
      mothersSchooling: this.enumOrNull(data.mothersSchooling, this.SCHOOLING_OPTIONS),
      ocupation: this.textOrNull(data.ocupation, 50),
    };
  }
}

module.exports = IdentificationInterview;
