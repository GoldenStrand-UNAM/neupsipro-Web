const Crypt = require('../crypt');

const crypt = new Crypt();

function uncryptNames(data) {
  const finalData = data.map(row => {
    return {
      ...row,
      first_name: crypt.decrypt(row.first_name),
      lastname_p: crypt.decrypt(row.lastname_p),
      lastname_m: crypt.decrypt(row.lastname_m),
    };
  });
  return finalData;
}

module.exports = uncryptNames;