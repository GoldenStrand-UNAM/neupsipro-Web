
class IdentificationInterview {
  constructor ({ id_user, current_step, current_section, initialProgress, readOnlyFields, completedSubSteps, data }) {
    this.id_user = id_user;
    this.current_step = current_step;
    this.current_section = current_section;
    this.completedSubSteps = completedSubSteps || [];

    switch (current_section) {
      case 1:
        this.data = this.mapSubStep1(initialProgress, readOnlyFields, data);
        break;

      case 2:
        this.data = this.mapSubStep2(initialProgress, data);
        break;

      case 3:
        this.data = this.mapSubStep3(initialProgress, data);
        break;

      case 4:
        this.data = this.mapSubStep4(initialProgress, data);
        break;

      default:
        throw new Error('Invalid section');
    }
  }

  // ----- Auxiliary functions ------------------------------------------------

  static MAX_TEXT_LENGTH = 30;

  static STRESS_WORK_OPTIONS = ['Bajo', 'Medio', 'Alto'];

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

  // Boolean for display: null if empty, otherwise a real boolean
  static booleanOrNull (value) {
    return value === null || value === undefined
      ? null
      : Boolean(value);
  }

  // Required boolean field, throws if missing
  static requiredBoolean (value, label) {
    if (value === null || value === undefined || value === '') {
      throw new Error(`${label} es obligatorio`);
    }

    return Boolean(value);
  }

  // Integer within [min, max] (max optional), or null if empty
  static integerOrNull (value, min, max, label) {
    if (value === null || value === undefined || value === '') return null;

    const num = Number(value);

    if (!Number.isInteger(num)) throw new Error(`${label} debe ser un número entero`);
    if (num < min) throw new Error(`${label} debe ser mayor o igual a ${min}`);
    if (max !== null && num > max) throw new Error(`${label} debe estar entre ${min} y ${max}`);

    return num;
  }

  // Required integer within [min, max] (max optional), throws if missing
  static requiredInteger (value, min, max, label) {
    if (value === null || value === undefined || value === '') {
      throw new Error(`${label} es obligatorio`);
    }

    return this.integerOrNull(value, min, max, label);
  }

  // Inclusion criteria score: must be 0, 1 or null
  static scoreOrNull (value, fieldName) {
    if (value === null || value === undefined || value === '') return null;

    const n = Number(value);
    if (![0, 1].includes(n)) throw new Error(`${fieldName} debe ser 0, 1 o null`);

    return n;
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
        schooling: IdentificationInterview.numberOrNull(base.schooling),
        residence: IdentificationInterview.textOrNull(base.residence, 80),
        fathersSchooling: IdentificationInterview.numberOrNull(base.fathers_schooling),
        mothersSchooling: IdentificationInterview.numberOrNull(base.mothers_schooling),
        ocupation: IdentificationInterview.textOrNull(base.ocupation, 50),
        scoreAge: IdentificationInterview.numberOrNull(base.score_age),
        scoreSchooling: IdentificationInterview.numberOrNull(base.score_schooling),
      },

      completedSteps: this.mapInitialProgress(initialProgress),
      completedSubSteps: this.completedSubSteps,

      id_user: this.id_user,
    };
  }

  // Situación Familiar
  mapSubStep2 (initialProgress, data) {
    const base = data || {};
    const children = Array.isArray(base.children) ? base.children : [];

    return {
      familySituation: {
        inRelationship: IdentificationInterview.booleanOrNull(base.in_relationship),
        relationshipDuration: IdentificationInterview.numberOrNull(base.relationship_duration),
        partnersName: IdentificationInterview.textOrNull(base.partners_name, 50),
        partnersAge: IdentificationInterview.numberOrNull(base.partners_age),
        partnersOcupation: IdentificationInterview.textOrNull(base.partners_ocupation, 50),
        partnersHealth: IdentificationInterview.textOrNull(base.partners_health, 150),
        hasChildren: IdentificationInterview.booleanOrNull(base.has_children),
        numberFamilyMembers: IdentificationInterview.numberOrNull(base.number_family_members),
        roomieInfo: IdentificationInterview.textOrNull(base.roomie_info, 150),
        aditionalInfo: IdentificationInterview.textOrNull(base.aditional_info, 400),
      },

      children: children.map(child => ({
        childName: IdentificationInterview.textOrNull(child.child_name, 80),
        childAge: IdentificationInterview.numberOrNull(child.child_age),
        childSchooling: IdentificationInterview.numberOrNull(child.child_schooling),
        childOccupation: IdentificationInterview.textOrNull(child.child_occupation, 80),
      })),

      completedSteps: this.mapInitialProgress(initialProgress),
      completedSubSteps: this.completedSubSteps,

      id_user: this.id_user,
    };
  }

  // Situación Laboral
  mapSubStep3 (initialProgress, data) {
    const base = data || {};

    return {
      employmentSituation: {
        hasJob: IdentificationInterview.booleanOrNull(base.has_job),
        workActivity: IdentificationInterview.textOrNull(base.work_activity, 150),
        stressWork: IdentificationInterview.textOrNull(base.stress_work, 10),
        employmentStatus: IdentificationInterview.textOrNull(base.employment_status, 150),
        seniority: IdentificationInterview.numberOrNull(base.seniority),
        workProblems: IdentificationInterview.textOrNull(base.work_problems, 150),
      },

      completedSteps: this.mapInitialProgress(initialProgress),
      completedSubSteps: this.completedSubSteps,

      id_user: this.id_user,
    };
  }

  // Conclusiones
  mapSubStep4 (initialProgress, data) {
    const base = data || {};

    return {
      conclusions: IdentificationInterview.textOrNull(base.conclusions, 1000),

      completedSteps: this.mapInitialProgress(initialProgress),
      completedSubSteps: this.completedSubSteps,

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
      schooling: this.integerOrNull(data.schooling, 0, 30, 'La escolaridad'),
      residence: this.textOrNull(data.residence, 80),
      fathersSchooling: this.integerOrNull(data.fathersSchooling, 0, 30, 'La escolaridad del padre'),
      mothersSchooling: this.integerOrNull(data.mothersSchooling, 0, 30, 'La escolaridad de la madre'),
      ocupation: this.textOrNull(data.ocupation, 50),
      scoreAge: this.scoreOrNull(data.scoreAge, 'El score de edad'),
      scoreSchooling: this.scoreOrNull(data.scoreSchooling, 'El score de escolaridad'),
    };
  }

  // Validate Situación Familiar
  static validateSubStep2 (data) {
    const inRelationship = this.requiredBoolean(data.inRelationship, '¿Tiene pareja?');
    const hasChildren = this.requiredBoolean(data.hasChildren, '¿Tiene hijos?');

    return {
      inRelationship,
      relationshipDuration: inRelationship
        ? this.integerOrNull(data.relationshipDuration, 0, null, 'La duración de la relación')
        : null,
      partnersName: inRelationship
        ? this.textOrNull(data.partnersName, 50)
        : null,
      partnersAge: inRelationship
        ? this.integerOrNull(data.partnersAge, 15, 120, 'La edad de la pareja')
        : null,
      partnersOcupation: inRelationship
        ? this.textOrNull(data.partnersOcupation, 50)
        : null,
      partnersHealth: inRelationship
        ? this.textOrNull(data.partnersHealth, 150)
        : null,

      hasChildren,
      numberFamilyMembers: this.requiredInteger(data.numberFamilyMembers, 0, null, 'El número de integrantes de la familia'),
      roomieInfo: this.textOrNull(data.roomieInfo, 150),
      aditionalInfo: this.textOrNull(data.aditionalInfo, 400),

      children: hasChildren
        ? this.validateChildren(data.children)
        : [],
    };
  }

  // Validate the children array: drop rows without a name and cap at 20 rows
  static validateChildren (children) {
    if (!Array.isArray(children)) return [];

    if (children.length > 20) {
      throw new Error('No se pueden registrar más de 20 hijos');
    }

    return children
      .filter(child => child && String(child.childName ?? '').trim() !== '')
      .map(child => ({
        childName: this.requiredText(child.childName, 80, 'El nombre del hijo'),
        childAge: this.integerOrNull(child.childAge, 0, null, 'La edad del hijo'),
        childSchooling: this.integerOrNull(child.childSchooling, 0, 30, 'La escolaridad del hijo'),
        childOccupation: this.textOrNull(child.childOccupation, 80),
      }));
  }

  // Validate Situación Laboral
  static validateSubStep3 (data) {
    const hasJob = this.requiredBoolean(data.hasJob, '¿Tiene trabajo?');

    return {
      hasJob,
      workActivity: hasJob ? this.textOrNull(data.workActivity, 150) : null,
      stressWork: hasJob ? this.enumOrNull(data.stressWork, this.STRESS_WORK_OPTIONS) : null,
      employmentStatus: hasJob ? this.textOrNull(data.employmentStatus, 150) : null,
      seniority: hasJob ? this.integerOrNull(data.seniority, 0, null, 'La antigüedad') : null,
      workProblems: hasJob ? this.textOrNull(data.workProblems, 150) : null,
    };
  }

  // Validate Conclusiones
  static validateSubStep4 (data) {
    return {
      conclusions: this.textOrNull(data.conclusions, 1000),
    };
  }

  // ========================== COMPLETION CHECKS ==========================
  // Shared by the GET use case (to compute completedSubSteps for the sidebar)
  // and the PATCH use case (to decide whether to flip the completed flag)

  static isSubStep1Complete (data) {
    const requiredFields = [
      data.interviewDate,
      data.interviewerName,
      data.address,
      data.healthcareSystem,
      data.weight,
      data.size,
      data.schooling,
      data.residence,
      data.fathersSchooling,
      data.mothersSchooling,
      data.ocupation,
    ];

    return requiredFields.every(field =>
      field !== null && field !== undefined && field !== '');
  }

  static isSubStep2Complete (data) {
    const requiredFields = [
      data.inRelationship,
      data.hasChildren,
      data.numberFamilyMembers,
    ];

    const baseComplete = requiredFields.every(field =>
      field !== null && field !== undefined && field !== '');

    if (!baseComplete) return false;

    // Claiming children but registering none leaves the substep incomplete
    if (data.hasChildren && data.children.length === 0) return false;

    return true;
  }

  static isSubStep3Complete (data) {
    if (data.hasJob === null || data.hasJob === undefined || data.hasJob === '') return false;

    if (data.hasJob) {
      const requiredFields = [data.workActivity, data.employmentStatus, data.stressWork];

      return requiredFields.every(field =>
        field !== null && field !== undefined && field !== '');
    }

    return true;
  }

  // Conclusiones is an optional, free-text field: the substep is always considered complete
  static isSubStep4Complete () {
    return true;
  }
}

module.exports = IdentificationInterview;