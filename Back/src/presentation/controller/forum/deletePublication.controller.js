class deletePublicationController {
  constructor (deletePublicationUseCase) {
    this.deletePublicationUseCase = deletePublicationUseCase;
  }

  async deletePublication (req, res) {
    try {
      const { idPublication } = req.params;
      const result = await this.deletePublicationUseCase.execute({ idPublication });
      return res.status(200).json(result);
    } catch (error) {
      const status = error.message === 'Publicación no encontrada' ? 404 : 400;
      return res.status(status).json({ error: error.message });
    }
  }
}

module.exports = deletePublicationController;