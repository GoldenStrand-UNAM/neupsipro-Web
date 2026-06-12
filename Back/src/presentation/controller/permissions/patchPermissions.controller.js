class PatchPermissionsController {
  constructor (patchPermissionsUseCase) {
    this.patchPermissionsUseCase = patchPermissionsUseCase;
  }

  // patch clinic permissions
  async patchPermission (req, res) {

    try {

      const { userId } = req.params;
      const { permissions } = req.body;

      await this.patchPermissionsUseCase.executePatch({
        userId,
        permissions,
      });

      res.status(200).json({
        success: true,
        message: 'Permissions saved',
      });

    } catch (err) {

      res.status(err.status || 500).json({
        success: false,
        error: err.message,
      });

    }
  }

}

module.exports = PatchPermissionsController;
