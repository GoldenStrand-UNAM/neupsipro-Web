
const TEST_REGISTRY = {

  //BANFE

  1: {
    name:        'BANFE',
    openRegister: (idUser, idApplication, test) =>
      openBANFEModal(idUser, idApplication, test, 'register'),
    openModify:  (idUser, idApplication, test) =>
      openBANFEModal(idUser, idApplication, test, 'modify'),
    openConsult: (idUser, idApplication, test) =>
      openBANFEModal(idUser, idApplication, test, 'consult'),
    endpoint:    (idUser, idApplication) =>
      `/api/usuarios/${idUser}/aplicaciones/${idApplication}/pruebas/1/resultados`,
  },

  //WAIS

  2: {
    name:        'WAIS',
    openRegister: (idUser, idApplication, test) =>
      openWAISModal(idUser, idApplication, test, 'register'),
    openModify:  (idUser, idApplication, test) =>
      openWAISModal(idUser, idApplication, test, 'modify'),
    openConsult: (idUser, idApplication, test) =>
      openWAISModal(idUser, idApplication, test, 'consult'),
    endpoint:    (idUser, idApplication) =>
      `/api/usuarios/${idUser}/aplicaciones/${idApplication}/pruebas/2/resultados`,
  },
  
  // ...



};