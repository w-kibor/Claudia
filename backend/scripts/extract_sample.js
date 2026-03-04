import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_FILE = path.join(__dirname, '../../data-pipeline/clean/recipes_sample.json');
const TARGET_FILE = path.join(__dirname, '../data/recipes_small.json');
const LIMIT = 1000;

console.log(`Starting extraction of ${LIMIT} recipes...`);

try {
  // We can't use require or JSON.parse on a 1GB file in Node.js easily,
  // but if it's already crashing the server, let's try reading it and 
  // taking the array directly, or we can use a stream if it fails.
  // Actually, fs.readFileSync of a 1GB file might exceed V8 heap.
  // We'll try to just read it, and if it fails, we use a basic stream approach.
  const rawData = fs.readFileSync(SOURCE_FILE, 'utf-8');
  console.log('File read into memory. Parsing JSON...');
  const jsonData = JSON.parse(rawData);
  
  if (jsonData && jsonData.recipes && Array.isArray(jsonData.recipes)) {
    console.log(`Found ${jsonData.recipes.length} recipes in source. Extracting ${LIMIT}...`);
    const subset = {
        recipes: jsonData.recipes.slice(0, LIMIT)
    };
    
    // Ensure data directory exists
    const dataDir = path.dirname(TARGET_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(TARGET_FILE, JSON.stringify(subset, null, 2));
    console.log(`Successfully wrote ${LIMIT} recipes to ${TARGET_FILE}!`);
  } else {
    console.error('JSON structure is not as expected. "recipes" array not found.');
  }

} catch (error) {
  console.error('Error extracting sample:', error.message);
}
