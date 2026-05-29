const Crypt = require('../crypt');

const crypt = new Crypt();

function uncryptUser (user) {
  const first_name = crypt.decrypt(user.first_name);
  const lastname_p = crypt.decrypt(user.lastname_p);
  const lastname_f = crypt.decrypt(user.lastname_f);
  const full_name = `${first_name} ${lastname_p} ${lastname_f || ''}`.trim();
  return {
    ...user,
    full_name,
    reference_number: crypt.decrypt(user.reference_number),
    birthdate: crypt.decrypt(user.birthdate),
    neuro_entry_date: crypt.decrypt(user.neuro_entry_date),
    amputation_date: crypt.decrypt(user.amputation_date),
  };
}

module.exports = uncryptUser;
