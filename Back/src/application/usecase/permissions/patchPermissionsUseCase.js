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
        consultation: actions.consultation ? 1 : 0,
        writing: actions.writing ? 1 : 0,
        edit: actions.edit ? 1 : 0,
        eliminate: actions.eliminate ? 1 : 0,
      };

      if (exception) {
        // eslint-disable-next-line no-await-in-loop
        await this.permissionsRepository.updateException({
          userId,
          moduleName,
          ...data,
        });
      } else {
        const moduleRows =
          // eslint-disable-next-line no-await-in-loop
          await this.permissionsRepository.fetchIdModule({ moduleName });

        const moduleId = moduleRows[0].id_module;

        // eslint-disable-next-line no-await-in-loop
        await this.permissionsRepository.insertException(
          userId,
          moduleId,
          data
        );
      }
    }

    return true;
  }
}

module.exports = PermissionsUseCase;
