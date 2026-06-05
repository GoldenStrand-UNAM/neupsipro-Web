class PostPeerSessionController {
  constructor (postPeerSessionUseCase) {
    this.postPeerSessionUseCase = postPeerSessionUseCase;
  }

  async postPeerSession (request, res) {
    try {
      const session = { ...request.body };
      const created = await this.postPeerSessionUseCase.execute(session);
      return res.status(201).json({ data: created });
    } catch (error) {
    console.error('POST PEER ERROR:', error);   // <-- temporal, mira la terminal
    if (error.code !== undefined || error.errno !== undefined) {
        return res.status(409).json({ error: 'Error al registrar la sesión.' });
    }
    return res.status(400).json({ error: error.message });
}
  }

  getPeerSessionsView (req, res) {
    try {
      res.locals.activePage = 'peerSessions';
      res.render('peerSessions/peerSessions', { tutorialModule: 'peerSessions' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = PostPeerSessionController;