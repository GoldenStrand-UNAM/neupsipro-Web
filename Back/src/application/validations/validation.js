class validation {
  validateEnum (param, enumOptions) {
    if (!Object.values(enumOptions).includes(param)) {
      throw new Error(`Elige una opción disponible: ${Object.values(enumOptions).join(', ')}`);
    } else
      return param;
  }

  validate (param) {
    if (param.value) {
      const value = String(param.value).trim();
      const emojiRegex =
      /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
      if (emojiRegex.test(value))
        throw new Error(`${param.label} no puede contener emojis`);
      if (param.value.trim().length > param.requiredLength)
        throw new Error(`${param.label} no puede superar los ${param.requiredLength} caracteres`);
      else
        return param.value;
    } else if (param.required) {
      if (!param.value || param.value.trim().length === 0)
        throw new Error(`${param.label} debe llenarse`);
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
    if (!param.required && !param.value) return param.value;
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    if (emojiRegex.test(param.value))
      throw new Error(`${param.label} no puede contener emojis`);
    const phoneStr = String(param.value).trim();
    const phoneRegex = /^\+?[0-9()-]+$/;
    if (phoneStr.length < 10)
      throw new Error(`${param.label} debe tener al menos 10 caracteres`);
    if (phoneStr.length > 20)
      throw new Error(`${param.label} no puede superar los 20 caracteres`);
    if (phoneRegex.test(phoneStr))
      return phoneStr;
    throw new Error(`${param.label} solo debe contener números y + - ( )`);
  }

  validateAffiliation (param) {
    if (!param.value || param.value.trim().length === 0) {
      if (param.required) throw new Error(`${param.label} debe llenarse`);
      return null;
    }
    const value = param.value.trim();
    if (value.length > param.requiredLength)
      throw new Error(`${param.label} no puede superar los ${param.requiredLength} caracteres`);
    if (!/^[A-ZÁÉÍÓÚÜÑ\s]+$/u.test(value))
      throw new Error(`${param.label} solo puede contener letras mayúsculas`);
    return value;
  }

  validateEmail (param) {
    this.validate({
      value: param.value,
      maxLength: 50,
      label: param.label,
      required: param.required,
    });
    const emojiRegex =
      /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    if (emojiRegex.test(param.value))
      throw new Error(`${param.label} no puede contener emojis`);
    if (!param.required && !param.value) return param.value;
    const emailStr = String(param.value).trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(emailStr))
      return emailStr;
    throw new Error(`${param.label} debe tener un formato de correo electrónico válido (ejemplo@correo.com)`);
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
