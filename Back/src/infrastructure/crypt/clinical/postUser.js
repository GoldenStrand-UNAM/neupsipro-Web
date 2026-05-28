const Crypt = require('../crypt');

const crypt = new Crypt();

function cryptUser (user) {
  return {
    ...user,
    firstName: crypt.encrypt(user.firstName),
    lastnameP: crypt.encrypt(user.lastnameP),
    lastnameM: crypt.encrypt(user.lastnameM),
    birthdate: crypt.encrypt(user.birthdate),
    email: crypt.encrypt(user.email),
    affiliation: crypt.encrypt(user.affiliation),
    activity: crypt.encrypt(user.activity),
    start_date: crypt.encrypt(user.start_date),
    finish_date: crypt.encrypt(user.finish_date),
    hours: crypt.encrypt(user.hours),
    emergency_contact_name: crypt.encrypt(user.emergency_contact_name),
    emergency_contact_phone: crypt.encrypt(user.emergency_contact_phone),
    emergency_contact_relation: crypt.encrypt(user.emergency_contact_relation),
  };
}