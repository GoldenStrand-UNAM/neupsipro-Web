class PermissionsUseCase {
  constructor (permissionsRepository) {
    this.permissionsRepository = permissionsRepository;
  }

  async executePatch ({ userId, permissions }) {

    for (const [moduleName, actions] of Object.entries(permissions)) {

      const exception =
        // eslint-disable-next-line no-await-in-loop
        await this.permissionsRepository.fetchExceptions({
          userId,
          moduleName,
        });

      const data = {
        consultation: (actions.consultation || actions.ver) ? 1 : 0,
        writing: (actions.writing || actions.crear) ? 1 : 0,
        edit: (actions.edit || actions.editar) ? 1 : 0,
        eliminate: (actions.eliminate || actions.eliminar) ? 1 : 0,
      };

      if (exception) {
        // eslint-disable-next-line no-await-in-loop
        await this.permissionsRepository.updateException({
          userId,
          moduleName,
          ...data,
        });
      } else {
        // eslint-disable-next-line no-await-in-loop
        const moduleId = await this.permissionsRepository.fetchIdModule({ moduleName });

        // eslint-disable-next-line no-await-in-loop
        await this.permissionsRepository.insertException({
          userId,
          idModule: moduleId,
          ...data,
        });
      }
    }

    return true;
  }
}

module.exports = PermissionsUseCase;
