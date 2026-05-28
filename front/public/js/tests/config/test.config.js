/* global openBANFEModal */
// eslint-disable-next-line no-unused-vars
const TEST_REGISTRY = {

  //BANFE

  1: {
    name: 'BANFE',
    openRegister: (idUser, idApplication, test) =>
      openBANFEModal(idUser, idApplication, { test, mode: 'register' }),
    openModify: (idUser, idApplication, test) =>
      openBANFEModal(idUser, idApplication, { test, mode: 'modify' }),
    openConsult: (idUser, idApplication, test) =>
      openBANFEModal(idUser, idApplication, { test, mode: 'consult' }),
    endpoint: (idUser, idApplication) =>
      `/api/users/${idUser}/applications/${idApplication}/tests/1/results`,
  },

    //WAIS

  2: {
    name: 'WAIS',
    openRegister: (idUser, idApplication, test) =>
      openWAISModal(idUser, idApplication, test, 'register'),
    openModify: (idUser, idApplication, test) =>
      openWAISModal(idUser, idApplication, test, 'modify'),
    openConsult: (idUser, idApplication, test) =>
      openWAISModal(idUser, idApplication, test, 'consult'),
    endpoint: (idUser, idApplication) =>
      `/api/users/${idUser}/applications/${idApplication}/tests/2/results`,
  },

};
