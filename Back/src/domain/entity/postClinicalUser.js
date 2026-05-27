class ClinicalUser {
  constructor (user) {
    this._validateDate({
      date: user.birthdate,
      label: 'El cumpleaños',
      limit: 1900,
      future: false,
    });
    this._validateDate({
      date: user.startDate,
      label: 'La fecha de inicio',
      limit: 1900,
      future: false,
    }),
    this._validateDate({
      date: user.endDate,
      label: 'La fecha de fin',
      limit: 2100,
      future: true,
    });
    this._validateNumber(user.hours, 'El campo de horas', 9999);
    Object.assign(this, user);
  }

  _validateDate (param) {
    if (param.date) {
      const [day, month, year] = param.date.split('/').map(Number);
      const inputDate = new Date(year, month - 1, day);
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      if ((inputDate < now || year > param.limit) && param.future)
        throw new Error(`${param.label} debe ser válida, desde hoy hasta antes de 2100`);
      else if ((inputDate >= now || year < param.limit) && !param.future)
        throw new Error(`${param.label} debe ser válida, anterior a hoy y después de 1900`);
    }
  }

  _validateNumber (param, label, max) {
    const number = Number(param);
    if (number || number === 0)
      if (Number.isInteger(number) && number <= max && number >= 0)
        return;
      else
        throw new Error(`${label} debe tener máximo de ${max}`);
  }
}

module.exports = ClinicalUser;
