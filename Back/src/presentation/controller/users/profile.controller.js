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

            const profileDTO = await this.getProfileUseCase.execute(userId);

            return res.status(200).json({
                success: true,
                data: profileDTO,
            });

        } catch (error) {
            if (error.message === "USER_NOT_FOUND") {
                return res.status(404).json({
                    success: false,
                    message: "User profile not found",
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