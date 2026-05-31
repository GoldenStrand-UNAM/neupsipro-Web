const Validation = require('./validation');

const validation = new Validation();

const enumSex = { FEMENINE: 'Femenino', MASCULINE: 'Masculino', NOT_SPECIFIED: 'Sin especificar' };
const enumModality = { ONLINE: 'En línea', IN_PERSON: 'Presencial' };
const enumLaterality = { LEFT: 'Zurda', RIGHT: 'Diestra', BOTH: 'Ambidiestra' };
const enumPhase = { PRE: 'Preprotésico', PROSTHETIC: 'Protésico', POST: 'Postprotésico', EXERCISE_ADAPT: 'Adaptación al ejercicio', DISCHARGE: 'Alta', DROPOUT: 'Baja de neuropsicología' };
const enumPairs = { YES: 'Sí asiste', NO: 'No asiste' };
const enumProsthetist = { JUAN: 'CPO Juan David Orozco', ALEJANDRA: 'CPO Alejandra Santos', MELVIN: 'CPO Melvin Arévalo' };

function validate (user) {
  const first = validateFirst(user);
  const second = validateSecond(user);
  const third = validateThird(user);

  return {
    ...first,
    ...second,
    ...third,
  };
}

function validateFirst (user) {
  return {
    firstName: validation.validate({
      value: user.firstName,
      maxLenght: 30,
      label: 'El nombre',
      required: true,
    }),
    lastnameP: validation.validate({
      value: user.lastnameP,
      maxLenght: 30,
      label: 'El apellido paterno',
      required: true,
    }),
    lastnameM: validation.validate({
      value: user.lastnameM,
      maxLenght: 30,
      label: 'El apellido materno',
      required: false,
    }),
    birthdate: validation.validateDate({
      date: user.birthdate,
      label: 'La fecha de nacimiento ',
      required: true,
    }),
    email: validation.validateEmail({
      value: user.email,
      label: 'El email',
      required: false,
    }),
    basePathology: validation.others({
      original: user.basePathology,
      other: user.otherPathology,
      requiredLength: 50,
      label: 'La etiología de amputación',
      required: true,
    }),
    amputationLevel: validation.validate({
      value: user.amputationLevel,
      maxLength: 30,
      label: 'El nivel de amputación ',
      required: true,
    }),
  };
}

function validateSecond (user) {
  return {
    userName: validation.validate({
      value: user.userName,
      maxLength: 30,
      label: 'El nombre de usuario',
      required: true,
    }),
    password: validation.validate({
      value: user.password,
      maxLength: 30,
      label: 'La contraseña',
      required: true,
    }),
    assigned: validation.validate({
      value: user.assigned,
      maxLength: 36,
      label: 'El clínico asignado',
      required: true,
    }),
    profilePhoto: validation.validate({
      value: user.profilePhoto,
      maxLength: 255,
      label: 'La URL de la foto de perfil',
      required: false,
    }),
    referenceNumber: validation.validateRefNumber(user.referenceNumber),
    prosthetist: validation.validateEnum(user.prosthetist, enumProsthetist),
    sex: validation.validateEnum(user.sex, enumSex),
  };
}

function validateThird (user) {
  return {
    modality: validation.validateEnum(user.modality, enumModality),
    laterality: validation.validateEnum(user.laterality, enumLaterality),
    phase: validation.validateEnum(user.phase, enumPhase),
    pairs: validation.validateEnum(user.pairs, enumPairs),
    amputationDate: validation.validateDate({
      date: user.amputationDate,
      label: 'La fecha de amputación ',
      required: true,
    }),
    neuroEntryDate: validation.validateDate({
      date: user.neuroEntryDate,
      label: 'La fecha de ingreso a neuropsicología ',
      required: false,
    }),
    phone: validation.validatePhone({
      value: user.phone,
      label: 'El teléfono',
      required: false,
    }),
  };
}

module.exports = validate;
