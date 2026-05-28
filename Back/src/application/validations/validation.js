class validation {
  validateEnum (param, enumOptions) {
    if (!Object.values(enumOptions).includes(param)) {
      throw new Error(`Elige una opción disponible: ${Object.values(enumOptions).join(', ')}`);
    } else //return crypt.encrypt(param);
      return param;
  }

  validate (param) {
    if (param.value) {
      if (param.value.trim().length > param.requiredLength) {
        throw new Error(`${param.label} no puede superar los ${param.requiredLength} caracteres`);
      } else //return crypt.encrypt(param);
        return param.value;
    } else if (param.required) {
      if (!param.value || param.value.trim().length === 0) {
        throw new Error(`${param.label} debe llenarse`);
      }
    } else return null;
  }

  others (param) {
    if (param.original === 'other')
      return this.validate({ value: param.other,
        requiredLength: param.requiredLength,
        label: param.label,
        required: param.required });
    return this.validate({ value: param.original,
      requiredLength: param.requiredLength,
      label: param.label,
      required: param.required });
  }

  validateDate (param) {
    if (param.date) {
      const regex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!param.date.match(regex)) throw new Error(`Formato de fecha inválido: ${param.label}`);

      const [day, month, year] = param.date.split('/').map(Number);
      const inputDate = new Date(year, month - 1, day);
      const isRealDate = inputDate.getFullYear() === year &&
                          inputDate.getMonth() === month - 1 &&
                          inputDate.getDate() === day;

      if (!isRealDate)
        throw new Error(`${param.label} no es una fecha válida en el calendario (ej: el día o mes no existen)`);

      //return crypt.encrypt(date);
      return param.date;
    } if (param.required)
      throw new Error(`${param.label} ' debe llenarse`);
    else
      return null;
  }

  validateNumber (param) {
    if (param.value === undefined || param.value === null || param.value === '') {
      if (param.required)
        throw new Error(`${param.label} es obligatorio`);
      return null;
    }

    const number = Number(param.value);

    if (Number.isNaN(number))
      throw new Error(`${param.label} debe ser un número válido`);

    if (!Number.isInteger(number) || number < 0)
      throw new Error(`${param.label} debe ser un entero positivo`);

    return number;
  }

  validatePhone (param) {
    this.validate({
      value: param.value,
      maxLength: 15,
      label: param.label,
      required: param.required,
    });
    if (!param.required) return param.value;
    const phoneStr = String(param.value).trim();
    const phoneRegex = /^\+?[0-9]+$/;

    if (phoneRegex.test(phoneStr))
      return phoneStr;
    throw new Error(`${param.label} solo debe contener números y un signo '+' opcional al inicio`);
  }
} module.exports = validation;
