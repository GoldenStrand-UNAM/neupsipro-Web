class GetPermissions {
  constructor (getPermissionsUseCase) {
    this.usecase = getPermissionsUseCase;
  }

  async getPage (req, res) {
    try {
      const { id_user } = req.params;

      // const permissionsData = await this.usecase.execute({ id_user });

      return res.render('permissions/permissions', {
        activePage: 'usuario',
        idUser: id_user,
        modules: [],
        tutorialModule: 'permissions',
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = GetPermissions;
