// scripts/check-names.js
const path = require('path');

const files = process.argv.slice(2);
let hasError = false;

const allowedUppercaseFiles = ['README.md', 'Dockerfile', 'LICENSE', 'CHANGELOG.md'];

files.forEach(file => {
  const relativePath = path.relative(process.cwd(), file);
  const normalizedPath = relativePath.replace(/\\/g, '/');

  if (normalizedPath.startsWith('uml/') || normalizedPath.includes('/uml/')) {
    return;
  }
  if (normalizedPath.startsWith('repository/') || normalizedPath.includes('/repository/')) {
    return;
  }
  if (normalizedPath.startsWith('assets/') || normalizedPath.includes('/assets/')) {
    return;
  }

  const parts = normalizedPath.split('/');
  const fileName = parts[parts.length - 1];

  parts.forEach(part => {
    if (
      part && 
      !part.startsWith('.') && 
      part !== 'node_modules' && 
      part !== 'Back' && 
      part !== 'Front' && 
      part !== 'uml' && 
      !allowedUppercaseFiles.includes(part)
    ) {
      const primeraLetra = part[0];
      if (primeraLetra !== primeraLetra.toLowerCase()) {
        console.error(`❌ Error: El archivo o carpeta "${part}" (en ${normalizedPath}) debe comenzar con minúscula.`);
        hasError = true;
      }
    }
  });

  if (normalizedPath.includes('/presentation/controller/') && fileName.endsWith('.js')) {
    if (!fileName.endsWith('.controller.js')) {
      console.error(`❌ Error: El controlador "${fileName}" no termina en .controller.js`);
      hasError = true;
    }
  }
});

if (hasError) {
  process.exit(1);
}