class AuthController {
    constructor(logoutUseCase) {
        this.logoutUseCase = logoutUseCase;
    }

    logout(req, res) {
        try {
            const token = req.headers.authorization?.split(" ")[1];

            this.logoutUseCase.execute(token);

            return res.status(200).json({
                message: "Sesión cerrada correctamente"
            });
        } catch (error) {
            return res.status(400).json({
                error: error.message
            });
        }
    }
}

module.exports = AuthController;