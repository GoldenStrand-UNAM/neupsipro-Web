class LoginController {
  constructor (loginUseCase) {
    this.loginUseCase = loginUseCase;
  }

  getLogin (req, res) {
    try {
      const message = req.session.info || '';
      if (req.session.info) {
        req.session.info = '';
      }

      const warning = req.session.warning || '';
      if (req.session.warning) {
        req.session.warning = '';
      }
      const errorMessage = req.query.error || null;
      res.render('auth/login.ejs', {
        isLoggedIn: req.session.isLoggedIn || false,
        username: req.session.usuario || '',
        isNew: false,
        info: message,
        warning,
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
  // Check if the request is from a mobile device
    const wantsJson = req.headers.accept?.includes('application/json');
    try {
      console.log(req.body);
      const { username, password } = req.body;
      if (typeof username === 'string' && username !== username.trim()) {
        if (wantsJson) return res.status(401).json({ code: 'INVALID_CREDENTIALS' });
        return res.render('auth/login.ejs', { error: 'Credenciales inválidas' });
      }
      console.log(username);
      if (!username || !password) {
        if (wantsJson) return res.status(400).json({ code: 'EMPTY_FIELDS' });
        return res.render('auth/login.ejs', { error: 'El usuario y la contraseña son obligatorios' });
      }
      if (username.length > 30 || password.length > 30) {
        if (wantsJson) return res.status(400).json({ code: 'INVALID_LENGTH' });
        return res.render('auth/login.ejs', { error: 'El usuario o la contraseña exceden el límite de 30 caracteres' });
      }

      const token = await this.loginUseCase.execute(username, password, req.ip, req.get('user-agent'));
      // Return the token
      if (wantsJson) return res.status(200).json({ token });

      res.cookie('jwt_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 2 * 60 * 60 * 1000, sameSite: 'strict' });
      return res.redirect('/dashboard');
    } catch (error) {
      if (wantsJson) {
        const m = error.message;
        if (m.includes('Límite')) return res.status(429).json({ code: 'TOO_MANY_REQUESTS' });
        if (m.includes('desactivada')) return res.status(403).json({ code: 'USER_DISABLED' });
        return res.status(401).json({ code: 'INVALID_CREDENTIALS' });
      }
      return res.render('auth/login.ejs', { error: error.message });
    }
  }

}

module.exports = LoginController;
