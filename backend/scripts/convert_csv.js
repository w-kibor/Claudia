import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_FILE = path.join(__dirname, '../../data-pipeline/raw/Recipes_with_Images.csv');
const TARGET_FILE = path.join(__dirname, '../data/recipes_small.json');

console.log(`Starting conversion of ${SOURCE_FILE}...`);

try {
  const rawData = fs.readFileSync(SOURCE_FILE, 'utf-8');

  // Parse CSV
  const parsed = Papa.parse(rawData, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length) {
    console.warn(`CSV Parsing warnings:`, parsed.errors);
  }

  const recipes = parsed.data.map((row) => {
    return {
      id: row.index ? row.index.toString() : Math.random().toString().slice(2, 8),
      title: row.title?.trim() || 'Unknown Recipe',
      about: row.about,
      // The CSV has "ingridients" instead of "ingredients"
      ingredients: row.ingridients
        ? row.ingridients
            .split('\n')
            .map((i) => i.trim())
            .filter(Boolean)
        : [],
      directions: row.preparation
        ? row.preparation
            .split('\n')
            .map((p) => p.trim())
            .filter(Boolean)
        : [],
      imageUrl: row.image_path ? `/api/${row.image_path}` : null,
      prepTime: 30, // Default prep time
      cuisine: 'Kenyan', // Based on the recipes like Kaimati, Mandazi
      difficulty: 'Medium',
      nutrition: {
        energy_kcal: row['energy(kcal)'],
        fat_g: row['fat(g)'],
        carbohydrates_g: row['carbohydrates(g)'],
        proteins_g: row['proteins(g)'],
        fibre_g: row['fibre(g)'],
      },
    };
  });

  const output = {
    recipes: recipes,
  };

  const dataDir = path.dirname(TARGET_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(TARGET_FILE, JSON.stringify(output, null, 2));
  console.log(`Successfully converted ${recipes.length} recipes to ${TARGET_FILE}!`);
} catch (error) {
  console.error('Error extracting sample:', error.message);
}
