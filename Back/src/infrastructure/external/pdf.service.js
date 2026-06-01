const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const puppeteer = require('puppeteer');

const TEMPLATE_PATH = path.resolve(__dirname, '../../../../front/views/pdf/exportReport.ejs');
const UNAM_LOGO_PATH = path.resolve(__dirname, '../../../../front/public/assets/Escudo-UNAM-escalable.svg');

// Renders the export report EJS template to a PDF buffer using headless Chromium.
class PdfService {
  async generate (report) {
    const unamLogo = this.#loadLogoDataUri(UNAM_LOGO_PATH);
    const html = await ejs.renderFile(TEMPLATE_PATH, { report, unamLogo });

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '24px', bottom: '24px', left: '24px', right: '24px' },
      });

      return pdfBuffer;
    } finally {
      await browser.close();
    }
  }

  // Reads an SVG logo from disk and returns it as a base64 data URI so it embeds in the PDF.
  #loadLogoDataUri (filePath) {
    try {
      // Path is a hardcoded asset constant, not user input.
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      const base64 = fs.readFileSync(filePath).toString('base64');
      return `data:image/svg+xml;base64,${base64}`;
    } catch {
      return '';
    }
  }
}

module.exports = PdfService;
