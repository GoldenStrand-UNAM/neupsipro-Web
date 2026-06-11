class PatchPermissionsController {
  constructor (patchPermissionsUseCase) {
    this.patchPermissionsUseCase = patchPermissionsUseCase;
  }

  // patch clinic permissions
  async patchPermission (req, res) {

    try {
      const { userId } = req.params;

      const permissions =
        await this.patchPermissionsUseCase.executePatch({ userId });

      //Successful response
      res.status(200).json({
        success: true,
        message: 'Permissions saved',
        permissions,
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
