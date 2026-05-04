/**
 * Controller for user profile management.
 * It handles the HTTP calls and manages the answers.
 */
class profileController {
    constructor (getProfileUseCase) {
        this.getProfileUseCase = getProfileUseCase;
    }

    async getProfile (req, res) {
        try {
            const { userId } = req.params;
            const authenticatedUser = req.user;
            const isValidIdFormat = /^u-[0-9]+$/.test(userId);

            if (!isValidIdFormat) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid user ID format"
                });
            }

            if (authenticatedUser && String(authenticatedUser.id) !== String(userId)) {
                return res.status(403).json({
                    success: false,
                    message: "No tienes permiso para ver este perfil"
                });
            }

            const profileDTO = await this.getProfileUseCase.execute(userId);
                return res.status(200).json({
                    success: true,
                    data: profileDTO
                });

        } catch (error) {
            if (error.message === "USER_NOT_FOUND") {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }
            
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    }
}

module.exports = profileController;