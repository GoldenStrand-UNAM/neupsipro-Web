class ExportTestResultsCsvController {
  constructor (exportTestResultsCsvUseCase) {
    this.useCase = exportTestResultsCsvUseCase;
  }

  async export (req, res) {
    try {
      const { test = 'all' } = req.query;

      const { filename, rows } = await this.useCase.execute({ test });

      const csv = this.toCsv(rows);

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`
      );

      return res.status(200).send(csv);
    } catch (error) {
      if (error.status && error.message) {
        return res.status(error.status).json({
          error: error.message,
        });
      }

      console.error('[ExportTestResultsCsvController]', error);

      return res.status(500).json({
        error: 'Internal server error',
      });
    }
  }

  toCsv (rows) {
    if (!rows || rows.length === 0) {
      return '\uFEFF';
    }

    const headers = Object.keys(rows[0]);

    const escapeCsvValue = (value) => {
      if (value === null || value === undefined) {
        return '';
      }

      const stringValue = String(value);
      const escapedValue = stringValue.replace(/"/g, '""');

      const shouldQuote =
        escapedValue.includes(',') ||
        escapedValue.includes('"') ||
        escapedValue.includes('\n') ||
        escapedValue.includes('\r');

      return shouldQuote ? `"${escapedValue}"` : escapedValue;
    };

    const csvRows = [
      headers.join(','),
      ...rows.map(row =>
        headers.map(header => escapeCsvValue(row[header])).join(',')),
    ];

    return `\uFEFF${csvRows.join('\n')}`;
  }
}

module.exports = ExportTestResultsCsvController;
