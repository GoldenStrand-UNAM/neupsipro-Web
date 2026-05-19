const Crypt = require('../external/crypt');
const crypt = new Crypt();

class validation {   
  validateEnum(param, enumOptions) {
    if (!Object.values(enumOptions).includes(param)) {
      throw new Error(`Elige una opción disponible: ${Object.values(enumOptions).join(', ')}`);
    } else return crypt.encrypt(param);
  }

  validate (param, requiredLength, label, required) {
    if(param) {
      if (param.trim().length > requiredLength) {
        throw new Error(`${label} no puede superar los ${requiredLength} caracteres`);
      } else return crypt.encrypt(param);
    } else if(required){
      if (!param || param.trim().length === 0) {
        throw new Error(`${label} debe llenarse`);
      }
    } else return null;
  }

  others(original, other, requiredLength, label, required){
    if (original === 'other') return this.validate(other, requiredLength, label, required);
    else return this.validate(original, requiredLength, label, required);
  }

  validateDate (date, label, required) { 
    if (date){
      const regex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!date.match(regex)) throw new Error('Formato de fecha inválido');

      const [day, month, year] = date.split('/').map(Number);
      const inputDate = new Date(year, month - 1, day);
      const now = new Date();
      const isRealDate = inputDate.getFullYear() === year && 
                          inputDate.getMonth() === month - 1 && 
                          inputDate.getDate() === day;

      if (!isRealDate || inputDate >= now || year < 1900) {
          throw new Error('La fecha debe ser válida, anterior a hoy y después de 1900');
      }

      return crypt.encrypt(date);
    } else if (required)
      throw new Error(`${label} ' debe llenarse`);
    else
      return null;
  }
} module.exports = validation;