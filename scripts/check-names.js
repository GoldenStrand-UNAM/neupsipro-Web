// scripts/check-names.js

// lint-staged pasa los archivos modificados como argumentos al script
const files = process.argv.slice(2);
let hasError = false;

files.forEach(file => {
  // Normalizamos las barras para evitar problemas entre Windows y Mac/Linux
  const normalizedPath = file.replace(/\\/g, '/');
  const parts = normalizedPath.split('/');
  const fileName = parts[parts.length - 1];

// Regla 1: Revisar que todos los folders y el archivo comiencen con minúscula
  parts.forEach(part => {
    // Ignoramos carpetas ocultas como .git o .husky, node_modules y valores vacíos
    if (part && !part.startsWith('.') && part !== 'node_modules') {
      
      // Tomamos la primera letra del nombre
      const primeraLetra = part[0];
      
      // Si la primera letra no es igual a su versión en minúscula, lanzamos el error
      if (primeraLetra !== primeraLetra.toLowerCase()) {
        console.error(`❌ Error: El archivo o carpeta "${part}" en la ruta "${file}" debe comenzar con minúscula.`);
        hasError = true;
      }
    }
  });

  // Regla 2: Revisar formato de controladores
if (normalizedPath.includes('/presentation/controller/') && fileName.endsWith('.js')) {
    if (!fileName.endsWith('.controller.js')) {
      console.error(`❌ Error: El archivo "${fileName}" está en una carpeta de controladores pero no termina en .controller.js`);
      hasError = true;
    }
  }

    // Regla 3: Revisar formato de rutas
if (normalizedPath.includes('/presentation/routes/') && fileName.endsWith('.js')) {
    if (!fileName.endsWith('.routes.js')) {
      console.error(`❌ Error: El archivo "${fileName}" está en una carpeta de rutas pero no termina en .routes.js`);
      hasError = true;
    }
  }

});



// Si hubo al menos un error, cancelamos el proceso (esto detiene el commit en Husky)
if (hasError) {
  process.exit(1);
} else {
  console.log('✅ Nomenclatura de archivos validada correctamente.');
}