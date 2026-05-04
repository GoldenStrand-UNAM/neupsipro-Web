class AuthMiddleware {
  constructor (jwtService, authService) {
    this.jwtService = jwtService;
    this.authService = authService;
  }
  verifyToken = (req, res, next) => {
    const cookies = req.cookies || {};
    const token = cookies.jwt_token;
    if (!token) {
      return res.redirect('/auth/');
    }
    try {
      if (this.authService && this.authService.isBlacklisted(token)) {
        res.clearCookie('jwt_token');
        return res.redirect('/auth/');
      }
      const decoded = this.jwtService.verifyToken(token);
      req.user = { userId: decoded.userId };
      next();
    } catch {
      res.clearCookie('jwt_token');
      return res.redirect('/auth/');
    }
  };
}

module.exports = AuthMiddleware;
