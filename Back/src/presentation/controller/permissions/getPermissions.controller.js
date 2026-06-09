const PermissionsDTO  = require('../../../application/dto/permissionsDTO');

class PermissionsController {
  constructor (permissionsUseCase) {
    this.permissionsUseCase = permissionsUseCase;
  }

  // get clinic permissions
  async getPermission (req, res) {

    try {
      const { userId } = req.params;

      const permissions =
        await this.permissionsUseCase.execute({ userId });

      const response = PermissionsDTO.fromEntity(permissions);

      //Successful response
      res.status(200).json(response);
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  /*
  getFinancialPage (req, res) {
    try {
      res.locals.activePage = 'usuarios';
      res.render('initialInterview/initialInterview', {
        id_user: req.params.id_user,
        current_step: 2,
        current_section: 1,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  */
}

module.exports = PermissionsController;
