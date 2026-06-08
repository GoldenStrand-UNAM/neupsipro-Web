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

  // Money: null if empty; integer >= 0, capped at max (default 1,000,000)
  validateMoney (param) {
    const label = param.label || 'El valor';
    const max = param.max ?? 1_000_000;

    if (param.value === undefined || param.value === null || param.value === '') {
      if (param.required) throw new Error(`${label} es obligatorio`);
      return null;
    }
    const number = Number(param.value);
    if (Number.isNaN(number))
      throw new Error(`${label} debe ser un número válido`);
    if (!Number.isInteger(number))
      throw new Error(`${label} debe ser un número entero (sin decimales)`);
    if (number < 0)
      throw new Error(`${label} no puede ser negativo`);
    if (number > max)
      throw new Error(`${label} no puede superar $${max.toLocaleString('es-MX')}`);
    return number;
  }

  // Free text: null if empty; rejects emojis and invisible/control characters,
  // capped at requiredLength (default 30)
  validateText (param) {
    const label = param.label || 'El texto';
    const requiredLength = param.requiredLength ?? 30;

    if (param.value === undefined || param.value === null || String(param.value).trim() === '') {
      if (param.required) throw new Error(`${label} debe llenarse`);
      return null;
    }

    const value = String(param.value).trim();

    // Covers pictographs, flags (regional indicators), skin-tone modifiers,
    // keycaps, variation selectors and ZWJ sequences — without touching plain digits.
    const emojiRegex = /\p{Extended_Pictographic}|\p{Emoji_Presentation}|\p{Regional_Indicator}/u;
    const emojiModifiers = /\u{1F3FB}|\u{1F3FC}|\u{1F3FD}|\u{1F3FE}|\u{1F3FF}|\u{FE0F}|\u{20E3}|\u{200D}/u;
    if (emojiRegex.test(value) || emojiModifiers.test(value))
      throw new Error(`${label} no puede contener emojis`);

    // Control chars + zero-width / invisible characters
    // eslint-disable-next-line no-control-regex
    const invisibleRegex = /[\u0000-\u001F\u007F-\u009F\u200B-\u200F\u202A-\u202E\u2060\uFEFF]/u;
    if (invisibleRegex.test(value))
      throw new Error(`${label} contiene caracteres no permitidos`);

    if (value.length > requiredLength)
      throw new Error(`${label} no puede superar los ${requiredLength} caracteres`);

    return value;
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
