class User {
  constructor (user) {
    this._validateDate({
      date: user.birthdate,
      label: 'El cumpleaños',
    });
    this._validateDate({
      date: user.amputationDate,
      label: 'La fecha de amputación',
    });
    this._validateDate({
      date: user.neuroEntryDate,
      label: 'La entrada a neuropsicología',
    });
    Object.assign(this, user);
  }

  _validateDate (param) {
    if (param.date) {
      const [day, month, year] = param.date.split('/').map(Number);
      const inputDate = new Date(year, month - 1, day);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (inputDate > now || year < 1900)
        throw new Error(`${param.label} debe ser válida, anterior a hoy y después de 1900`);
    }
  }
}

module.exports = User;
