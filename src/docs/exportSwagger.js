const fs = require('fs');
const { specs } = require('./swagger');

const outputPath = './swagger-output.json';

fs.writeFile(outputPath, JSON.stringify(specs, null, 2), (err) => {
  if (err) {
    console.error('Erreur lors de l\'écriture du fichier Swagger JSON:', err);
  } else {
    console.log(`Swagger JSON exporté avec succès vers ${outputPath}`);
  }
}); 