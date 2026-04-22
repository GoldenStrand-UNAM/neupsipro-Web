class LoginController {
    constructor (loginUseCase) {
        this.loginUseCase = loginUseCase;
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
            const errorMessage = req.query.error || null;
            res.render("auth/login.ejs", {
            isLoggedIn: req.session.isLoggedIn || false,
            username: req.session.usuario || "",
            isNew: false,
            info: message,
            warning: warning,
            privilegios: req.session.privilegios || [],
            error: errorMessage,
        });

        } catch (error) {
            return res.status(400).json({
                error: error.message,
            });
        }
    }

     async postLogin (req, res) {
        try {
            const {username, password} = req.body;
            if (!username || !password) {
                return res.render ('auth/login.ejs', {
                    error: 'El usuario y la contraseña son obligatorios',
                });
            }
            if (username.length > 30 || password.length > 30) {
                return res.render ('auth/login.ejs', {
                    error: 'El usuario o la contraseña exceden el límite de 30 caracteres',
                });
            }

            const ipAddress = req.ip;
            const userAgent = req.get('user-agent');

            const token = await this.loginUseCase.execute(username, password, ipAddress, userAgent);
            res.cookie('jwt_token', token, {httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge : 2 * 60 * 60 * 1000});
            return res.redirect('/home');
        } catch (error) {
            return res.render('auth/login.ejs', {error: error.message});
        }
    }

}

module.exports = LoginController;