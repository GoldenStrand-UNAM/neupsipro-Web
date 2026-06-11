const PermissionsDTO  = require('../../../application/dto/permissionsDTO');
const ExceptionsDTO = require('../../../application/dto/permissionsExceptionsDTO');

const MODULE_DICTIONARY = {
  'User Management': { roleKey: 'User',              labelEs: 'Gestión de Usuarios' },
  'Psychological Tests': { roleKey: 'Tests',             labelEs: 'Pruebas Psicológicas' },
  'Initial Interview': { roleKey: 'Initial interview', labelEs: 'Entrevista Inicial' },
  'Clinical': { roleKey: 'Clinical',          labelEs: 'Colaboradores' },
  'Permissions': { roleKey: 'Permissions',       labelEs: 'Permisos del Sistema' },
  'Forum': { roleKey: 'Publication',       labelEs: 'Foro' },
  'Profile': { roleKey: 'Interaction',       labelEs: 'Perfil' },
  'Tutorial': { roleKey: 'Tutorial',          labelEs: 'Tutoriales' },
  'Modules': { roleKey: 'Modules',           labelEs: 'Módulos' },
  'Results': { roleKey: 'Results',           labelEs: 'Resultados' },
  'Appointment': { roleKey: 'Appointment',       labelEs: 'Citas' },
};

class PermissionsController {
  constructor (permissionsUseCase) {
    this.permissionsUseCase = permissionsUseCase;
  }

  // eslint-disable-next-line max-lines-per-function
  async getPage (req, res) {
    try {
      const { userId } = req.params;
      const {
        permissions,
        exceptions,
        name,
      } = await this.permissionsUseCase.execute({ userId });
      const fullName = name?.name || 'Colaborador';
      const rawPermissions = PermissionsDTO.fromEntity(permissions) || {};
      const rawExceptions = ExceptionsDTO.fromEntity(exceptions) || {};
      const adaptedModules = Object.keys(rawPermissions)
        .filter(moduleName => moduleName !== 'Tutorial' && moduleName !== 'Modules').map(moduleName => {
        const userActions = rawPermissions[moduleName];
        const config = MODULE_DICTIONARY[moduleName] || { roleKey: moduleName, labelEs: moduleName };
        const exceptionKey = Object.keys(rawExceptions).find(key => key.toLowerCase() === config.roleKey.toLowerCase());
        const roleActions = exceptionKey ? rawExceptions[exceptionKey] : [];
        const isCustom = userActions.consultation !== null && userActions.consultation !== undefined;
        const roleHas = (actionName) => {
          if (Array.isArray(roleActions)) return roleActions.includes(actionName);
          return roleActions[actionName] === 1;
        };
        const canView = isCustom ? userActions.consultation === 1 : roleHas('consultation');
        const canCreate = isCustom ? userActions.writing === 1 : roleHas('writing');
        const canEdit = isCustom ? userActions.edit === 1 : roleHas('edit');
        const canEliminate = isCustom ? userActions.eliminate === 1 : roleHas('eliminate');
        return {
          idModule: moduleName,
          moduleName: config.labelEs,
          hasCustomException: isCustom,
          actions: {
            ver: { active: canView },
            crear: { active: canCreate },
            editar: { active: canEdit },
            eliminar: { active: canEliminate },
          },
        };
      });
      return res.render('permissions/permissions', {
        activePage: 'usuario',
        user: {
          idUser: userId,
          userName: fullName,
        },
        modules: adaptedModules,
        tutorialModule: 'permissions',
      });
    } catch (error) {
      console.error('Error cargando la vista de permisos:', error);
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
