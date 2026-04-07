const express = require("express");
const router  = express.Router();

router.get("/usuarios", (req, res) => {
    res.locals.activePage = 'usuarios';
    res.render("Users/usuarios");
});

module.exports = router;