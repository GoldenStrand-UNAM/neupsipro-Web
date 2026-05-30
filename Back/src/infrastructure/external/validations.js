const Crypt = require('../external/crypt');

const crypt = new Crypt();

class validation {
  validateEnum (param, enumOptions) {
    if (!Object.values(enumOptions).includes(param))
      throw new Error(`Elige una opción disponible: ${Object.values(enumOptions).join(', ')}`);
    else
      return param;
  }

  validate (param, requiredLength, label, required) {
    const value = String(param).trim();
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    if (emojiRegex.test(value)) {
      throw new Error(`${label} no puede contener emojis`);
    }
    if (param) {
      if (param.trim().length > requiredLength)
        throw new Error(`${label} no puede superar los ${requiredLength} caracteres`);
      else
        return param;
    } else if (required) {
      if (!param || param.trim().length === 0)
        throw new Error(`${label} debe llenarse`);
    } else return null;
  }

  others (original, other, requiredLength, label, required) {
    if (original === 'other') return this.validate(other, requiredLength, label, required);
    return this.validate(original, requiredLength, label, required);
  }

  validateDate (date, label, required) {
    if (date) {
      const regex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!date.match(regex)) throw new Error('Formato de fecha inválido');

      const [day, month, year] = date.split('/').map(Number);
      const inputDate = new Date(year, month - 1, day);
      const now = new Date();
      const isRealDate = inputDate.getFullYear() === year &&
                          inputDate.getMonth() === month - 1 &&
                          inputDate.getDate() === day;

      if (!isRealDate || inputDate >= now || year < 1900)
        throw new Error('La fecha debe ser válida, anterior a hoy y después de 1900');
      return date;
    } if (required)
      throw new Error(`${label} ' debe llenarse`);
    else
      return null;
  }

  validatePhone (value, label, required) {
    if (!value || String(value).trim().length === 0) {
      if (required) throw new Error(`${label} debe llenarse`);
      return null;
    }
    const phoneStr = String(value).trim();
    if (phoneStr.length > 20)
      throw new Error(`${label} no puede superar los 20 caracteres`);
    if (phoneStr.length < 8)
      throw new Error(`${label} debe tener al menos 8 caracteres`);
    const phoneRegex = /^\+?[0-9() -]+$/;
    if (phoneRegex.test(phoneStr))
      return phoneStr;
    throw new Error(`${label} solo debe contener números y + - ( )`);
  }

  validateEmail (value, label, required) {
    if (!value || String(value).trim().length === 0) {
      if (required) throw new Error(`${label} debe llenarse`);
      return null;
    }
    const emojiRegex =
      /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

    if (emojiRegex.test(value)) {
      throw new Error(`${label} no puede contener emojis`);
    }
    const emailStr = String(value).trim();
    if (emailStr.length > 50)
      throw new Error(`${label} no puede superar los 50 caracteres`);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(emailStr))
      return emailStr;
    throw new Error(`${label} debe tener un formato de correo electrónico válido (ejemplo@correo.com)`);
  }

  validateRefNumber (param) {
    if (!param) throw new Error('El folio es obligatorio');
    if (param.length < 8 || param.length > 10)
      throw new Error('El folio debe tener entre 8 y 10 carateres');
    const numPart = param.substring(0, 3);
    if (!/^[0-9]{3}$/.test(numPart))
      throw new Error('El folio debe tener un formato de 000P-XXX');
    if (param[3] !== 'P' && param[3] !== 'p')
      throw new Error('El folio debe tener un formato de 000P-XXX');
    if (param[4] !== '-')
      throw new Error('El folio debe tener un formato de 000P-XXX');
    const letterPart = param.substring(5);
    if (!/^[A-Za-z]{3,5}$/.test(letterPart)) return 'error';

    return param.toUpperCase();
  }
} module.exports = validation;
