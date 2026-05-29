/* global openBANFEModal, openWAISModal, openREYModal, openMOCAModal */
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
      openWAISModal(idUser, idApplication, { test, mode: 'register' }),
    openModify: (idUser, idApplication, test) =>
      openWAISModal(idUser, idApplication, { test, mode: 'modify' }),
    openConsult: (idUser, idApplication, test) =>
      openWAISModal(idUser, idApplication, { test, mode: 'consult' }),
    endpoint: (idUser, idApplication) =>
      `/api/users/${idUser}/applications/${idApplication}/tests/2/results`,
  },

  //REY

  3: {
    name: 'REY',
    openRegister: (idUser, idApplication, test) =>
      openREYModal({ idUser, idApplication, test, mode: 'register' }),
    openModify: (idUser, idApplication, test) =>
      openREYModal({ idUser, idApplication, test, mode: 'modify' }),
    openConsult: (idUser, idApplication, test) =>
      openREYModal({ idUser, idApplication, test, mode: 'consult' }),
    endpoint: (idUser, idApplication) =>
      `/api/users/${idUser}/applications/${idApplication}/tests/3/results`,
    schoolingEndpoint: (idUser) =>
      `/api/users/${idUser}/schooling`,
    ageEndpoint: (idUser) =>
      `/api/users/${idUser}/age`,
  },

<<<<<<< HEAD
    // NIHS

  5: {
    name: 'NIH',
    openRegister: (idUser, idApplication, test) =>
      openNIHModal(idUser, idApplication, test, 'register'),
    openModify: (idUser, idApplication, test) =>
      openNIHModal(idUser, idApplication, test, 'modify'),
    openConsult: (idUser, idApplication, test) =>
      openNIHModal(idUser, idApplication, test, 'consult'),
    endpoint: (idUser, idApplication) =>
      `/api/users/${idUser}/applications/${idApplication}/tests/5/results`,
=======
  // MOCA

  4: {
    name: 'MOCA',
    openRegister: (idUser, idApplication, test) =>
      openMOCAModal({ idUser, idApplication, test, mode: 'register' }),
    openModify: (idUser, idApplication, test) =>
      openMOCAModal({ idUser, idApplication, test, mode: 'modify' }),
    openConsult: (idUser, idApplication, test) =>
      openMOCAModal({ idUser, idApplication, test, mode: 'consult' }),
    endpoint: (idUser, idApplication) =>
      `/api/users/${idUser}/applications/${idApplication}/tests/4/results`,
    schoolingEndpoint: (idUser) =>
      `/api/users/${idUser}/schooling`,
>>>>>>> ec21f77fd5b8061df958c081301b1b5b720aaf89
  },

};
