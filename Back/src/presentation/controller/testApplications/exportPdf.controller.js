class ExportPdfController {
  constructor (exportPdfUseCase) {
    this.exportPdfUseCase = exportPdfUseCase;
  }

  // GET /users/:id_user/applications/:id_application/export
  async export (req, res) {
    try {
      const { id_user, id_application } = req.params;
      const { pdfBuffer, filename } = await this.exportPdfUseCase.execute({ id_user, id_application });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.send(pdfBuffer);
    } catch (error) {
      return res.status(error.status ?? 500).json({ error: error.message });
    }
  }
}

module.exports = ExportPdfController;
