import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Load recipes data
let recipes = [];
try {
  const dataPath = path.join(__dirname, 'data/recipes_small.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const parsedData = JSON.parse(rawData);

  if (parsedData && parsedData.recipes) {
    recipes = parsedData.recipes.map(r => {
      // Extract a numeric seed from the ID for consistent images
      const seedMatch = r.id ? r.id.match(/\d+/) : null;
      const seed = seedMatch ? parseInt(seedMatch[0]) : Math.floor(Math.random() * 1000);

      // Validate imageUrl - only use if it's a valid HTTP(S) URL
      let validImageUrl = null;
      if (r.imageUrl && typeof r.imageUrl === 'string' && (r.imageUrl.startsWith('http://') || r.imageUrl.startsWith('https://'))) {
        validImageUrl = r.imageUrl;
      }

      return {
        ...r,
        name: r.title || 'Unknown Recipe',
        // Use food-specific placeholder images instead of generic picsum
        image: validImageUrl || `https://loremflickr.com/800/600/food,recipe?lock=${seed}`,
        // Format properties for UI
        prepTime: (r.prepTime && r.prepTime > 0) ? `${r.prepTime} mins` : '20 mins',
        cuisine: r.cuisine || 'International'
      };
    });
    console.log(`✅ Loaded ${recipes.length} recipes from small dataset with mapped food images`);
  }
} catch (error) {
  console.error('❌ Error loading recipes:', error.message);
}

// Routes

// Health check
app.get('/', (req, res) => {
  res.json({
    message: '🍳 Claudia Recipe API',
    version: '1.0.0',
    endpoints: {
      recipes: '/api/recipes',
      recipeById: '/api/recipes/:id',
      search: '/api/recipes/search?q=query',
      cuisines: '/api/cuisines',
      stats: '/api/stats'
    }
  });
});

// Get all recipes (with pagination)
app.get('/api/recipes', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedRecipes = recipes.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedRecipes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(recipes.length / limit),
        totalRecipes: recipes.length,
        recipesPerPage: limit
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get recipe by ID
app.get('/api/recipes/:id', (req, res) => {
  try {
    const recipe = recipes.find(r => r.id === req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        error: 'Recipe not found'
      });
    }

    res.json({
      success: true,
      data: recipe
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Search recipes
app.get('/api/recipes/search', (req, res) => {
  try {
    const query = req.query.q?.toLowerCase();

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const results = recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(query) ||
      recipe.cuisine.toLowerCase().includes(query) ||
      recipe.ingredients?.some(ing => ing.toLowerCase().includes(query))
    );

    res.json({
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all unique cuisines
app.get('/api/cuisines', (req, res) => {
  try {
    const cuisines = [...new Set(recipes.map(r => r.cuisine))].sort();

    res.json({
      success: true,
      data: cuisines
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Filter by cuisine
app.get('/api/recipes/cuisine/:cuisine', (req, res) => {
  try {
    const cuisine = req.params.cuisine;
    const filtered = recipes.filter(r =>
      r.cuisine.toLowerCase() === cuisine.toLowerCase()
    );

    res.json({
      success: true,
      data: filtered,
      count: filtered.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Filter by difficulty
app.get('/api/recipes/difficulty/:level', (req, res) => {
  try {
    const level = req.params.level;
    const filtered = recipes.filter(r =>
      r.difficulty.toLowerCase() === level.toLowerCase()
    );

    res.json({
      success: true,
      data: filtered,
      count: filtered.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get stats
app.get('/api/stats', (req, res) => {
  try {
    const cuisineCount = {};
    const difficultyCount = {};

    recipes.forEach(recipe => {
      cuisineCount[recipe.cuisine] = (cuisineCount[recipe.cuisine] || 0) + 1;
      difficultyCount[recipe.difficulty] = (difficultyCount[recipe.difficulty] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        totalRecipes: recipes.length,
        cuisines: cuisineCount,
        difficulties: difficultyCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Serving ${recipes.length} recipes`);
  console.log(`\n📖 API Documentation:`);
  console.log(`   GET  /api/recipes           - Get all recipes (paginated)`);
  console.log(`   GET  /api/recipes/:id       - Get recipe by ID`);
  console.log(`   GET  /api/recipes/search    - Search recipes (?q=query)`);
  console.log(`   GET  /api/cuisines          - Get all cuisines`);
  console.log(`   GET  /api/recipes/cuisine/:cuisine - Filter by cuisine`);
  console.log(`   GET  /api/recipes/difficulty/:level - Filter by difficulty`);
  console.log(`   GET  /api/stats             - Get statistics\n`);
});
