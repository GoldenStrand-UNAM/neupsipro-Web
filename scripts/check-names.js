// scripts/check-names.js
const path = require('path');

// lint-staged pasa los archivos modificados como argumentos
const files = process.argv.slice(2);
let hasError = false;

// Archivos comunes que sí permitimos en mayúscula
const allowedUppercaseFiles = ['README.md', 'Dockerfile', 'LICENSE'];

files.forEach(file => {
  // 1. Convertimos la ruta absoluta (C:/Users/...) a ruta relativa (Back/src/...)
  const relativePath = path.relative(process.cwd(), file);
  
  // 2. Normalizamos las barras para evitar problemas entre Windows y Mac/Linux
  const normalizedPath = relativePath.replace(/\\/g, '/');
  const parts = normalizedPath.split('/');
  const fileName = parts[parts.length - 1];

  // Regla 1: Revisar que todos los folders y el archivo comiencen con minúscula
  parts.forEach(part => {
    // Ignoramos carpetas ocultas, node_modules, la carpeta 'Back' y archivos permitidos
    if (
      part && 
      !part.startsWith('.') && 
      part !== 'node_modules' && 
      part !== 'Back' && 
      part !== 'Front' && 
      !allowedUppercaseFiles.includes(part)
    ) {
      const primeraLetra = part[0];
      if (primeraLetra !== primeraLetra.toLowerCase()) {
        console.error(`❌ Error: El archivo o carpeta "${part}" (en ${normalizedPath}) debe comenzar con minúscula.`);
        hasError = true;
      }
    }
  });

  // Regla 2: Revisar formato de controladores
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