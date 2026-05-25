class PostClinicalUserController {

  postUser (req, res) {
    try {
      res.locals.activePage = 'clinical';
      res.render('clinical/postClinicalUser');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
module.exports =  PostClinicalUserController;