const express = require('express');


module.exports = (logoutController, loginController) => {
  const router = express.Router();

  router.get('/', (req, res) => loginController.getLogin(req, res));
  router.post('/login', (req, res) => loginController.postLogin(req, res));
  router.post('/logout', (req, res) => logoutController.logout(req, res));

  return router;
};
