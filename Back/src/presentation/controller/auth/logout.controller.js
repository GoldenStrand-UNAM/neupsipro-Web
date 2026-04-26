class Logout {
    constructor (logoutUseCase) {
        this.logoutUseCase = logoutUseCase;
    }

    async logout (req, res) {
        try {
            const token = req.cookies?.jwt_token;

            if (token) {
                await this.logoutUseCase.execute(token);
            }

            res.clearCookie('jwt_token');

            if (req.headers['content-type'] === 'application/json') {
                return res.status(200).json({ message: "Sesión cerrada correctamente" });
            }

            return res.redirect('/auth/');
        } catch (error) {
            return res.status(500).json({
                error: error.message,
            });
        }
    }
}

module.exports = Logout;