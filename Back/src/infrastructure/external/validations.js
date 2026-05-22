const Crypt = require('../external/crypt');

const crypt = new Crypt();

class validation {
  validateEnum (param, enumOptions) {
    if (!Object.values(enumOptions).includes(param)) {
      throw new Error(`Elige una opción disponible: ${Object.values(enumOptions).join(', ')}`);
    } else //return crypt.encrypt(param);
      return param;
  }

  validate (param, requiredLength, label, required) {
    if (param) {
      if (param.trim().length > requiredLength) {
        throw new Error(`${label} no puede superar los ${requiredLength} caracteres`);
      } else //return crypt.encrypt(param);
        return param;
    } else if (required) {
      if (!param || param.trim().length === 0) {
        throw new Error(`${label} debe llenarse`);
      }
    } else return null;
  }

  others (original, other, requiredLength, label, required) {
    if (original === 'other') return this.validate(other, requiredLength, label, required);
    return this.validate(original, requiredLength, label, required);
  }

  validateDate (date, label, required) {
    if (date) {
      const regex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!date.match(regex)) throw new Error(`Formato de fecha inválido: ${label}`);

      const [day, month, year] = date.split('/').map(Number);
      const inputDate = new Date(year, month - 1, day);
      const now = new Date();
      const isRealDate = inputDate.getFullYear() === year &&
                          inputDate.getMonth() === month - 1 &&
                          inputDate.getDate() === day;

      if (!isRealDate || inputDate >= now || year < 1900) {
        throw new Error(`${label} debe ser válida, anterior a hoy y después de 1900`);
      }

      //return crypt.encrypt(date);
      return date;
    } if (required)
      throw new Error(`${label} ' debe llenarse`);
    else
      return null;
  }

  validateFutureDate (date, label, required) {
    if (date) {
      const regex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!date.match(regex)) throw new Error(`Formato de fecha inválido: ${label}`);

      const [day, month, year] = date.split('/').map(Number);
      const inputDate = new Date(year, month - 1, day);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const isRealDate = inputDate.getFullYear() === year &&
                          inputDate.getMonth() === month - 1 &&
                          inputDate.getDate() === day;

      if (!isRealDate || inputDate < now || year > 2100) {
        throw new Error(`${label} debe ser válida, desde hoy hasta antes de 2100`);
      }

      //return crypt.encrypt(date);
      return date;
    } if (required)
      throw new Error(`${label} ' debe llenarse`);
    else
      return null;
  }

  validateNumber(param, label, max, required) {
    const number = Number(param);
    if (number || number === 0)
      if (Number.isInteger(number) && number <= max && number >= 0)
        return number;
      else
        throw new Error(`${label} debe ser un entero máximo ${max}`);
    else if (required)
      throw new Error(`${label} es obligatorio`);
    return null;
  }

  validatePhone(phone, label, required) {
    const valid = this.validate(phone, 15, label, required);
    if (!required) return phone;
    const phoneStr = String(phone).trim();
    const phoneRegex = /^\+?[0-9]+$/;

    if (phoneRegex.test(phoneStr)) {
      return phoneStr;
    } else {
      throw new Error(`${label} solo debe contener números y un signo '+' opcional al inicio`);
    }
  }
} module.exports = validation;