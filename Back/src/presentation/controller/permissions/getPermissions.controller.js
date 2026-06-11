const PermissionsDTO  = require('../../../application/dto/permissionsDTO');
const ExceptionsDTO = require('../../../application/dto/exceptionsDTO');

class PermissionsController {
  constructor (permissionsUseCase) {
    this.permissionsUseCase = permissionsUseCase;
  }

  // get clinic permissions
  async getPermission (req, res) {
    try {
      const { userId } = req.params;

      const {
        permissions,
        exceptions,
      } = await this.permissionsUseCase.execute({ userId });

      const response = {
        permissions: PermissionsDTO.fromEntity(permissions),
        exceptions: ExceptionsDTO.fromEntity(exceptions),
      };

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
