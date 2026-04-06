class AuthController {
    constructor (logoutUseCase, loginUseCase) {
        this.logoutUseCase = logoutUseCase;
        this.loginUseCase = loginUseCase
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

            res.render("login.ejs", {
            isLoggedIn: req.session.isLoggedIn || false,
            username: req.session.usuario || "",
            isNew: false,
            info: message,
            warning: warning,
            csrfToken: req.csrfToken(),
            privilegios: req.session.privilegios || [],
        });

        } catch (error) {
            return res.status(400).json({
                error: error.message,
            });
        }
    }

    login (req, res) {
        try {
            const {username, password} = req.body;
            const token = this.loginUseCase.execute(username, password);
            res.cookie('jwt_token', token, {httpOnly: true, secure: true});
            return res.redirect('/home');
        } catch (error) {
            return res.render('login.ejs', {error: error.message});
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