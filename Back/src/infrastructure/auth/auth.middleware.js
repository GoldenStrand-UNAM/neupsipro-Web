class AuthMiddleware {
  constructor (jwtService, authService) {
    this.jwtService = jwtService;
    this.authService = authService;
  }
  verifyToken = (req, res, next) => {
    // if is phone the response should be json
    const wantsJson = req.headers.accept?.includes('application/json');

    // Get cookie token and bearer token
    const cookieToken = req.cookies?.jwt_token;
    const bearerHeader = req.headers.authorization || '';
    const bearerToken = bearerHeader.startsWith('Bearer ')
      ? bearerHeader.slice(7)
      : null;

    const token = cookieToken || bearerToken;

    // Function to handle failures
    const fail = (code) => {
      res.clearCookie('jwt_token');
      if (wantsJson) return res.status(401).json({ code });
      return res.redirect('/auth/');
    };

    // no token provided
    if (!token) return fail('NO_TOKEN');

    try {
      if (this.authService && this.authService.isBlacklisted(token)) {
        return fail('INVALID_SESSION');
      }
      const decoded = this.jwtService.verifyToken(token);
      req.user = { userId: decoded.userId };
      next();
    } catch {
      return fail('TOKEN_EXPIRED');
    }
  };
}

module.exports = AuthMiddleware;