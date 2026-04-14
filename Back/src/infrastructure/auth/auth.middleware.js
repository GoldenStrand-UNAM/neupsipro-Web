class AuthMiddleware {
    constructor (jwtService) {
        this.jwtService = jwtService;
    }
    verifyToken = (req, res, next) => {
        const token = req.cookies.jwt_token;
        if (!token) {
            return res.redirect('/auth/')
        }
        try {
            const decoded = this.jwtService.verifyToken(token);
            req.user = decoded;
            next();
        } catch (error) {
            res.clearCookie('jwt_token');
            const encodedMessage = encodeURIComponent(error);
            return res.redirect(`/auth/login?error=${encodedMessage}`);
        }
    }
}

module.exports = AuthMiddleware;