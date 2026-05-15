/* global openBANFEModal, openWAISModal, openMOCAModal */

// eslint-disable-next-line no-unused-vars
const TEST_REGISTRY = {

  //BANFE

  1: {
    name: 'BANFE',
    openRegister: (idUser, idApplication, test) =>
      openBANFEModal(idUser, idApplication, test, 'register'),
    openModify: (idUser, idApplication, test) =>
      openBANFEModal(idUser, idApplication, test, 'modify'),
    openConsult: (idUser, idApplication, test) =>
      openBANFEModal(idUser, idApplication, test, 'consult'),
    endpoint: (idUser, idApplication) =>
      `/api/usuarios/${idUser}/aplicaciones/${idApplication}/pruebas/1/resultados`,
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
      `/api/usuarios/${idUser}/aplicaciones/${idApplication}/pruebas/2/resultados`,
  },

  3: {
    name: 'REY',
    openRegister: (idUser, idApplication, test) =>
      openREYModal(idUser, idApplication, test, 'register'),
    openModify: (idUser, idApplication, test) =>
      openREYModal(idUser, idApplication, test, 'modify'),
    openConsult: (idUser, idApplication, test) =>
      openREYModal(idUser, idApplication, test, 'consult'),
    endpoint: (idUser, idApplication) =>
      `/api/usuarios/${idUser}/aplicaciones/${idApplication}/pruebas/3/resultados`,
    schoolingEndpoint: (idUser) =>
      `/api/usuarios/${idUser}/escolaridad`,
    ageEndpoint: (idUser) =>
      `/api/usuarios/${idUser}/edad`,
  },

  // MOCA

  4: {
    name: 'MOCA',
    openRegister: (idUser, idApplication, test) =>
      openMOCAModal(idUser, idApplication, test, 'register'),
    openModify: (idUser, idApplication, test) =>
      openMOCAModal(idUser, idApplication, test, 'modify'),
    openConsult: (idUser, idApplication, test) =>
      openMOCAModal(idUser, idApplication, test, 'consult'),
    endpoint: (idUser, idApplication) =>
      `/api/usuarios/${idUser}/aplicaciones/${idApplication}/pruebas/4/resultados`,
    schoolingEndpoint: (idUser) =>
      `/api/usuarios/${idUser}/escolaridad`,
  },

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
      `/api/usuarios/${idUser}/aplicaciones/${idApplication}/pruebas/5/resultados`,
  },

};
