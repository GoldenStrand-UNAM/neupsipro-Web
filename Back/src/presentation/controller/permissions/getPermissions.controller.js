const PermissionsDTO  = require('../../../application/dto/permissionsDTO');
const ExceptionsDTO = require('../../../application/dto/permissionsExceptionsDTO');

class PermissionsController {
  constructor (permissionsUseCase) {
    this.permissionsUseCase = permissionsUseCase;
  }

  async getPage (req, res) {
    try {
      const { userId } = req.params;

      const { permissions, modules } = await this.permissionsUseCase.execute({ userId });

      return res.render('permissions/permissions', {
        activePage: 'usuario',
        idUser: userId,
        modules: modules || [],
        permissions: permissions || {},
        tutorialModule: 'permissions',
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

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
}

module.exports = PermissionsController;
