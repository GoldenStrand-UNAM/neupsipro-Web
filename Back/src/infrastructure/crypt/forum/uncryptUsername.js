const Crypt = require('../crypt');

const crypt = new Crypt();

class uncrypt {
  uncryptUsername (data) {
    const ufirstName = crypt.decrypt(data.first_name);
    const uLastnameP = crypt.decrypt(data.lastname_p);
    const uLastnameM = crypt.decrypt(data.lastname_m);
    const fullname = `${ufirstName} ${uLastnameP} ${uLastnameM || ''}`.trim();

    return {
      ...data,
      full_name: fullname,
    };
  }

  uncryptDetailUsername (data) {
    return {
      ...data,
      first_name: crypt.decrypt(data.first_name),
      lastname_p: crypt.decrypt(data.lastname_p),
      lastname_m: crypt.decrypt(data.lastname_m),
    };
  }
}

module.exports = uncrypt;
