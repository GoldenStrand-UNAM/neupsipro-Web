const logger = require('../../../infrastructure/external/logger.service');

class Logout {
  constructor (logoutUseCase, jwtService) {
    this.logoutUseCase = logoutUseCase;
    this.jwtService = jwtService;
  }

  // function to handle logout request
  async logout (req, res) {
    logger.debug('logout: inicio', { userId: req.user?.id, ip: req.ip });
    try {
      const token = req.cookies?.jwt_token;
      let sessionId = null;

      if (token) {
        try {
          const decoded = this.jwtService.verifyToken(token);
          sessionId = decoded.session;
        } catch {
          // Catch the error log here
        }
      }

      else if (req.headers.authorization) {
        const parts = req.headers.authorization.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
          sessionId = parts[1];
        }
      }

      // If a token exists, invalidate it in the backend
      if (sessionId) {
        await this.logoutUseCase.execute(sessionId);
      }

      // Clear the cookie on the client side
      res.clearCookie('jwt_token');

      logger.info('logout: éxito', { userId: req.user?.id, sessionId, ip: req.ip });

      // Check if the request expects a JSON response
      if (req.headers['content-type'] === 'application/json' || req.xhr || !req.accepts('html')) {
        return res.status(200).json({ message: 'Sesión cerrada correctamente' });
      }

      // For non-JSON requests, redirect to the login page
      return res.redirect('/auth/');
    } catch (error) {
      logger.error('logout: error', { error, userId: req.user?.id, ip: req.ip });
      return res.status(500).json({
        error: error.message,
      });
    }
  }
}

module.exports = Logout;
