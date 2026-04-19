class AuthMiddleware {
    constructor (jwtService, authService) {
        this.jwtService = jwtService;
        this.authService = authService;
    }
    verifyToken = (req, res, next) => {
        const cookies = req.cookies || {};
        const token = cookies.jwt_token;
        if (!token) {
            console.log("Middleware: No hay token");
            return res.redirect('/auth/');
        }
        try {
            if (this.authService && this.authService.isBlacklisted(token)) {
                console.log("Token en blacklist. Sesión cerrada.");
                res.clearCookie('jwt_token');
                return res.redirect('/auth/');
            }
            const decoded = this.jwtService.verifyToken(token);
            req.user = {userId: decoded.userId};
            next();
        } catch (error) {
            console.error("Token invalido o expirado:", error.message);
            res.clearCookie('jwt_token');
            return res.redirect('/auth/');
        }
    }
}

module.exports = AuthMiddleware;