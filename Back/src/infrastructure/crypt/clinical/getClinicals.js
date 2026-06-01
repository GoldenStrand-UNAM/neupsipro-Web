const Crypt = require('../crypt');

const crypt = new Crypt();

class uncrypt {
  uncryptUser (user) {
    const ufirstName = crypt.decrypt(user.first_name);
    const uLastnameP = crypt.decrypt(user.lastname_p);
    const uLastnameM = crypt.decrypt(user.lastname_m);
    const full_name = `${ufirstName} ${uLastnameP} ${uLastnameM || ''}`.trim();

    return {
      ...user,
      full_name,
      affiliation: crypt.decrypt(user.affiliation),
      activity: crypt.decrypt(user.activity),
    };
  }

  uncryptAll (user) {
    const ufirstName = crypt.decrypt(user.first_name);
    const uLastnameP = crypt.decrypt(user.lastname_p);
    const uLastnameM = crypt.decrypt(user.lastname_m);
    const full_name = `${ufirstName} ${uLastnameP} ${uLastnameM || ''}`.trim();

    return {
      ...user,
      full_name,
    };
  }

  uncryptClinical (user) {
    return {
      ...user,
      first_name: crypt.decrypt(user.first_name),
      lastname_p: crypt.decrypt(user.lastname_p),
      lastname_m: crypt.decrypt(user.lastname_m),
      affiliation: crypt.decrypt(user.affiliation),
      activity: crypt.decrypt(user.activity),
      email: crypt.decrypt(user.email),
      birthdate: crypt.decrypt(user.birthdate),
      emergency_contact_name: crypt.decrypt(user.emergency_contact_name),
      emergency_contact_phone: crypt.decrypt(user.emergency_contact_phone),
      emergency_contact_relation: crypt.decrypt(user.emergency_contact_relation),
    };
  }

  uncryptPatients (user) {
    return {
      ...user,
      first_name: crypt.decrypt(user.first_name),
      lastname_p: crypt.decrypt(user.lastname_p),
      lastname_m: crypt.decrypt(user.lastname_m),
      reference_number: crypt.decrypt(user.reference_number),
    };
  }
};

module.exports = uncrypt;
