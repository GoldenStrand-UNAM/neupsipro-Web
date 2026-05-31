const Crypt = require('../crypt');

const crypt = new Crypt();

function safeDecrypt (value) {
  if (!value) return value;
  try {
    return crypt.decrypt(value);
  } catch (error) {
    return value;
  }
}

function uncryptData (data) {
  return {
    ...data,
    first_name: safeDecrypt(data.first_name),
    lastname_p: safeDecrypt(data.lastname_p),
    lastname_m: safeDecrypt(data.lastname_m),
    birthdate: safeDecrypt(data.birthdate),
    neuro_entry_date: safeDecrypt(data.neuro_entry_date),
    prosthetist: safeDecrypt(data.prosthetist),
    assigned_clinic_name: safeDecrypt(data.assigned_clinic_name),
  };
}

module.exports = { safeDecrypt };
