class AuthController {
    constructor (logoutUseCase) {
        this.logoutUseCase = logoutUseCase;
    }

    getLogin (req, res) {
        try {
            const message = req.session.info || "";
            if (req.session.info) {
                req.session.info = "";
            }

            const warning = req.session.warning || "";
            if (req.session.warning) {
                req.session.warning = "";
            }

            

        } catch (error) {
            return res.status(400).json({
                error: error.message,
            });
        }
    }

    logout (req, res) {
        try {
            const token = req.headers.authorization?.split(" ")[1];

            this.logoutUseCase.execute(token);

            return res.status(200).json({
                message: "Sesión cerrada correctamente",
            });
        } catch (error) {
            return res.status(400).json({
                error: error.message,
            });
        }
    }
}

module.exports = AuthController;