class Logout {
  constructor (logoutUseCase) {
    this.logoutUseCase = logoutUseCase;
  }

  // function to handle logout request
  async logout (req, res) {
    try {
      const token = req.cookies?.jwt_token;

      // If a token exists, invalidate it in the backend
      if (token) {
        await this.logoutUseCase.execute(token);
      }

      // Clear the cookie on the client side
      res.clearCookie('jwt_token');

      // Check if the request expects a JSON response
      if (req.headers['content-type'] === 'application/json') {
        return res.status(200).json({ message: 'Sesión cerrada correctamente' });
      }

      // For non-JSON requests, redirect to the login page
      return res.redirect('/auth/');
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
}

module.exports = Logout;
