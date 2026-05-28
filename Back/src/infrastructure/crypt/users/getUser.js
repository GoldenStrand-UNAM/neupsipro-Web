const Crypt = require('../crypt');

const crypt = new Crypt();

function uncryptUser (user) {
  return {
    ...user,
    origin: crypt.decrypt(user.origin),
    neuro_status: crypt.decrypt(user.neuro_status),
    base_patology: crypt.decrypt(user.base_patology),
    notes: crypt.decrypt(user.notes),
    attendance: crypt.decrypt(user.attendance),
    reference_number: crypt.decrypt(user.reference_number),
    amputation_date: crypt.decrypt(user.amputation_date),
    group_intervention: crypt.decrypt(user.group_intervention),
    laterality: crypt.decrypt(user.laterality),
    prosthetist: crypt.decrypt(user.prosthetist),
    neuro_entry_date: crypt.decrypt(user.neuro_entry_date),
    amputation_level: crypt.decrypt(user.amputation_level),
    first_name: crypt.decrypt(user.first_name),
    lastname_p: crypt.decrypt(user.lastname_p),
    lastname_m: crypt.decrypt(user.lastname_m),
    birthdate: crypt.decrypt(user.birthdate),
    assigned_clinic: crypt.decrypt(user.assigned_clinic),
  };
}

module.exports = uncryptUser;
