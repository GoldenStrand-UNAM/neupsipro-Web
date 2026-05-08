class HomeController {
  getHome (req, res) {
    const usuario = req.user;

    return res.render('home.ejs', { user: usuario });
  }
}

module.exports = HomeController;
