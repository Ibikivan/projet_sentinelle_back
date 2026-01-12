const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Import swagger specs
const specs = require('./swagger');

// Output path
const outputPath = path.join(__dirname, '..', '..', 'swagger.json');

// Write to file
fs.writeFileSync(outputPath, JSON.stringify(specs, null, 2), 'utf8');

console.log(`✅ Swagger JSON exported to: ${outputPath}`);
console.log(`📊 Total paths: ${Object.keys(specs.paths || {}).length}`);
console.log(`📦 Total schemas: ${Object.keys(specs.components?.schemas || {}).length}`);