const Validation = require('./validation');

const validation = new Validation();

const enumActivity = { SOCIAL_SERVICE: 'Servicio social', INTERNSHIP: 'Prácticas profesionales', VOLUNTEER: 'Voluntariado',
  TITULAR: 'Titular', SUMMER: 'Verano de investigación' };

function validate (user, { passwordRequired = true } = {}) {
  const first = validateFirst(user);
  const second = validateSecond(user, { passwordRequired });
  const third = validateThird(user);

  return {
    ...first,
    ...second,
    ...third,
  };
}

function validateFirst (user) {
  const firstName = validation.validate({
    value: user.firstName,
    maxLenght: 30,
    label: 'El nombre',
    required: true,
  });
  const lastnameP = validation.validate({
    value: user.lastnameP,
    maxLenght: 30,
    label: 'El apellido paterno',
    required: true,
  });
  const lastnameM = validation.validate({
    value: user.lastnameM,
    maxLenght: 30,
    label: 'El apellido materno',
    required: false,
  });
  const birthdate = validation.validateDate({
    date: user.birthdate,
    label: 'La fecha de nacimiento ',
    required: true });
  const email = validation.validateEmail({
    value: user.email,
    label: 'El email',
    required: false });
  return {
    firstName,
    lastnameP,
    lastnameM,
    birthdate,
    email,
  };
}

function validateSecond (user, { passwordRequired }) {
  const affiliation = validation.validateAffiliation({
    value: user.affiliation,
    requiredLength: 20,
    label: 'La afiliación',
    required: true });
  const activity = validation.validateEnum(
    user.activity,
    enumActivity
  );
  const startDate = validation.validateDate({
    date: user.startDate,
    label: 'La fecha de inicio',
    required: false });
  const finishDate = validation.validateDate({
    date: user.finishDate,
    label: 'La fecha de fin',
    required: false });
  const hours = validation.validateNumber({
    value: user.hours,
    label: 'Las horas',
    required: false });
  const username = validation.validate({
    value: user.username,
    maxLenght: 30,
    label: 'El nombre de usuario',
    required: true });
  const password = validation.validate({
    value: user.password,
    maxLenght: 30,
    label: 'La contraseña',
    required: passwordRequired,
  });
  return { affiliation, activity, startDate, finishDate, hours, username, password };
}

function validateThird (user) {
  const emergencyContactName = validation.validate({
    value: user.emergencyContactName,
    maxLenght: 50,
    label: 'El nombre del contacto de emergencia',
    required: false });
  const emergencyContactPhone = validation.validatePhone({
    value: user.emergencyContactPhone,
    label: 'El número del contacto de emergencia',
    required: false });
  const emergencyContactRelation = validation.validate({
    value: user.emergencyContactRelation,
    maxLenght: 25,
    label: 'La relación del contacto de emergencia',
    required: false });
  return {
    emergencyContactName,
    emergencyContactPhone,
    emergencyContactRelation,
  };
}

module.exports = validate;
