import express from 'express';
import cors from 'cors';
import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { connectToDatabase, getDatabaseUri, isDatabaseConnected } from './db.js';
import { InventoryItem } from './models/InventoryItem.js';
import { UserRecipe } from './models/UserRecipe.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDirectory = path.join(__dirname, 'uploads');

fs.mkdirSync(uploadDirectory, { recursive: true });

const app = express();
const PORT = process.env.PORT || 3001;
const DEFAULT_PROFILE_ID = process.env.DEFAULT_PROFILE_ID || 'demo-user';
const envOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((url) => url.trim().replace(/\/$/, ''))
  : [];
const allowedOrigins = [
  'http://localhost:5173',
  'https://claudia-sand.vercel.app',
  ...envOrigins,
];
// Initialize Gemini client (requires GEMINI_API_KEY in .env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDirectory);
  },
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname || '').toLowerCase();
    callback(null, `${Date.now()}-${crypto.randomUUID()}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    if (file.mimetype?.startsWith('image/')) {
      callback(null, true);
      return;
    }

    callback(new Error('Only image uploads are supported.'));
  },
});

// Middleware
app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (e.g. curl, Postman, mobile apps)
      if (!origin) {
        return callback(null, true);
      }

      if (!allowedOrigins.includes(origin)) {
        console.log('Blocked by CORS:', origin);
        return callback(new Error('CORS policy violation'), false);
      }

      return callback(null, true);
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use('/uploads', express.static(uploadDirectory));

function buildImageUrl(req, imagePath, fallbackSeed = 'food') {
  if (imagePath) {
    return `${req.protocol}://${req.get('host')}${imagePath}`;
  }

  return `https://loremflickr.com/800/600/food,recipe?lock=${fallbackSeed}`;
}

function parseListField(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item) => `${item}`.trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();

    if (!trimmed) {
      return [];
    }

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => `${item}`.trim()).filter(Boolean);
      }
    } catch {
      // Fall through to newline parsing.
    }

    return trimmed
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function getProfileId(req) {
  return req.query.profileId || req.body.profileId || DEFAULT_PROFILE_ID;
}

function ensureValidObjectId(id, res, resourceName) {
  if (mongoose.isValidObjectId(id)) {
    return true;
  }

  res.status(400).json({
    success: false,
    error: `Invalid ${resourceName} id.`,
  });
  return false;
}

function formatUserRecipe(recipe, req) {
  return {
    id: recipe._id.toString(),
    name: recipe.title,
    image: buildImageUrl(req, recipe.imagePath, recipe._id.toString()),
    prepTime: recipe.prepTime,
    difficulty: recipe.difficulty,
    cuisine: recipe.cuisine,
    ingredients: recipe.ingredients,
    directions: recipe.directions,
    instructions: recipe.directions,
    notes: recipe.notes,
    source: 'user',
    createdAt: recipe.createdAt,
  };
}

function formatInventoryItem(item, req) {
  return {
    id: item._id.toString(),
    name: item.name,
    category: item.category,
    quantity: item.quantity,
    unit: item.unit,
    location: item.location,
    status: item.status,
    notes: item.notes,
    expiresAt: item.expiresAt,
    image: buildImageUrl(req, item.imagePath, item._id.toString()),
    createdAt: item.createdAt,
  };
}

async function ensureDatabaseConnection(req, res) {
  try {
    await connectToDatabase();
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    res.status(503).json({
      success: false,
      error: 'MongoDB is unavailable. Start the database and try again.',
      details: error.message,
    });
    return false;
  }
}

// Load recipes data
let recipes = [];
try {
  const dataPath = path.join(__dirname, 'data/recipes_small.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const parsedData = JSON.parse(rawData);

  if (parsedData && parsedData.recipes) {
    recipes = parsedData.recipes.map((r) => {
      // Extract a numeric seed from the ID for consistent images
      const seedMatch = r.id ? r.id.match(/\d+/) : null;
      const seed = seedMatch ? parseInt(seedMatch[0]) : Math.floor(Math.random() * 1000);

      // Validate imageUrl - only use if it's a valid HTTP(S) URL or local path
      let validImageUrl = null;
      if (
        r.imageUrl &&
        typeof r.imageUrl === 'string' &&
        (r.imageUrl.startsWith('http://') ||
          r.imageUrl.startsWith('https://') ||
          r.imageUrl.startsWith('/'))
      ) {
        validImageUrl = r.imageUrl;
      }

      return {
        ...r,
        name: r.title || 'Unknown Recipe',
        // Use food-specific placeholder images instead of generic picsum
        image: validImageUrl || `https://loremflickr.com/800/600/food,recipe?lock=${seed}`,
        // Format properties for UI
        prepTime: r.prepTime && r.prepTime > 0 ? `${r.prepTime} mins` : '20 mins',
        cuisine: r.cuisine || 'International',
      };
    });
    console.log(`✅ Loaded ${recipes.length} recipes from small dataset with mapped food images`);
  }
} catch (error) {
  console.error('❌ Error loading recipes:', error.message);
}

// Routes

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: {
      connected: isDatabaseConnected(),
      uri: getDatabaseUri(),
    },
  });
});

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
      stats: '/api/stats',
      ownRecipes: '/api/user/recipes',
      updateRecipe: 'PATCH /api/user/recipes/:id',
      deleteRecipe: 'DELETE /api/user/recipes/:id',
      inventory: '/api/user/inventory',
      updateInventory: 'PATCH /api/user/inventory/:id',
      deleteInventory: 'DELETE /api/user/inventory/:id',
      kitchenSummary: '/api/user/summary',
    },
  });
});

app.get('/api/user/summary', async (req, res) => {
  if (!(await ensureDatabaseConnection(req, res))) {
    return;
  }

  try {
    const profileId = getProfileId(req);
    const [recipeCount, inventoryItems] = await Promise.all([
      UserRecipe.countDocuments({ profileId }),
      InventoryItem.find({ profileId }).lean(),
    ]);

    const onHand = inventoryItems.filter((item) => item.status !== 'needed').length;
    const missing = inventoryItems.filter((item) => item.status === 'needed').length;

    res.json({
      success: true,
      data: {
        profileId,
        ownRecipes: recipeCount,
        inventory: {
          onHand,
          missing,
          total: inventoryItems.length,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/user/recipes', async (req, res) => {
  if (!(await ensureDatabaseConnection(req, res))) {
    return;
  }

  try {
    const profileId = getProfileId(req);
    const userRecipes = await UserRecipe.find({ profileId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: userRecipes.map((recipe) => formatUserRecipe(recipe, req)),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/user/recipes', upload.single('image'), async (req, res) => {
  if (!(await ensureDatabaseConnection(req, res))) {
    return;
  }

  try {
    const profileId = getProfileId(req);
    const title = req.body.title?.trim();

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Recipe title is required.',
      });
    }

    const recipe = await UserRecipe.create({
      profileId,
      title,
      cuisine: req.body.cuisine?.trim() || 'Homestyle',
      prepTime: req.body.prepTime?.trim() || '20 mins',
      difficulty: req.body.difficulty || 'Medium',
      ingredients: parseListField(req.body.ingredients),
      directions: parseListField(req.body.directions),
      notes: req.body.notes?.trim() || '',
      imagePath: req.file ? `/uploads/${req.file.filename}` : null,
    });

    res.status(201).json({
      success: true,
      data: formatUserRecipe(recipe, req),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.patch('/api/user/recipes/:id', upload.single('image'), async (req, res) => {
  if (!(await ensureDatabaseConnection(req, res))) {
    return;
  }

  if (!ensureValidObjectId(req.params.id, res, 'recipe')) {
    return;
  }

  try {
    const profileId = getProfileId(req);
    const recipe = await UserRecipe.findOne({ _id: req.params.id, profileId });

    if (!recipe) {
      return res.status(404).json({ success: false, error: 'Recipe not found.' });
    }

    if (req.body.title !== undefined) recipe.title = req.body.title.trim();
    if (req.body.cuisine !== undefined) recipe.cuisine = req.body.cuisine.trim();
    if (req.body.prepTime !== undefined) recipe.prepTime = req.body.prepTime.trim();
    if (req.body.difficulty !== undefined) recipe.difficulty = req.body.difficulty;
    if (req.body.notes !== undefined) recipe.notes = req.body.notes.trim();
    if (req.body.ingredients !== undefined) recipe.ingredients = parseListField(req.body.ingredients);
    if (req.body.directions !== undefined) recipe.directions = parseListField(req.body.directions);
    if (req.file) {
      recipe.imagePath = `/uploads/${req.file.filename}`;
    }

    await recipe.save();
    res.json({ success: true, data: formatUserRecipe(recipe, req) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/user/recipes/:id', async (req, res) => {
  if (!(await ensureDatabaseConnection(req, res))) {
    return;
  }

  if (!ensureValidObjectId(req.params.id, res, 'recipe')) {
    return;
  }

  try {
    const profileId = getProfileId(req);
    const recipe = await UserRecipe.findOneAndDelete({ _id: req.params.id, profileId });

    if (!recipe) {
      return res.status(404).json({ success: false, error: 'Recipe not found.' });
    }

    res.json({ success: true, data: { id: req.params.id } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/user/inventory', async (req, res) => {
  if (!(await ensureDatabaseConnection(req, res))) {
    return;
  }

  try {
    const profileId = getProfileId(req);
    const inventoryItems = await InventoryItem.find({ profileId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: inventoryItems.map((item) => formatInventoryItem(item, req)),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/user/inventory', upload.single('image'), async (req, res) => {
  if (!(await ensureDatabaseConnection(req, res))) {
    return;
  }

  try {
    const profileId = getProfileId(req);
    const name = req.body.name?.trim();

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Inventory item name is required.',
      });
    }

    const quantity = Number.parseFloat(req.body.quantity || '1');

    const inventoryItem = await InventoryItem.create({
      profileId,
      name,
      category: req.body.category?.trim() || 'General',
      quantity: Number.isFinite(quantity) ? quantity : 1,
      unit: req.body.unit?.trim() || 'item',
      location: req.body.location || 'Fridge',
      status: req.body.status || 'available',
      notes: req.body.notes?.trim() || '',
      expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : null,
      imagePath: req.file ? `/uploads/${req.file.filename}` : null,
    });

    res.status(201).json({
      success: true,
      data: formatInventoryItem(inventoryItem, req),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.patch('/api/user/inventory/:id', upload.single('image'), async (req, res) => {
  if (!(await ensureDatabaseConnection(req, res))) {
    return;
  }

  if (!ensureValidObjectId(req.params.id, res, 'inventory item')) {
    return;
  }

  try {
    const profileId = getProfileId(req);
    const item = await InventoryItem.findOne({ _id: req.params.id, profileId });

    if (!item) {
      return res.status(404).json({ success: false, error: 'Inventory item not found.' });
    }

    if (req.body.name !== undefined) item.name = req.body.name.trim();
    if (req.body.category !== undefined) item.category = req.body.category.trim();
    if (req.body.unit !== undefined) item.unit = req.body.unit.trim();
    if (req.body.notes !== undefined) item.notes = req.body.notes.trim();
    if (req.body.location !== undefined) item.location = req.body.location;
    if (req.body.status !== undefined) item.status = req.body.status;
    if (req.body.quantity !== undefined) {
      const qty = Number.parseFloat(req.body.quantity);
      item.quantity = Number.isFinite(qty) ? qty : item.quantity;
    }
    if (req.body.expiresAt !== undefined) {
      item.expiresAt = req.body.expiresAt ? new Date(req.body.expiresAt) : null;
    }
    if (req.file) {
      item.imagePath = `/uploads/${req.file.filename}`;
    }

    await item.save();
    res.json({ success: true, data: formatInventoryItem(item, req) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/user/inventory/:id', async (req, res) => {
  if (!(await ensureDatabaseConnection(req, res))) {
    return;
  }

  if (!ensureValidObjectId(req.params.id, res, 'inventory item')) {
    return;
  }

  try {
    const profileId = getProfileId(req);
    const item = await InventoryItem.findOneAndDelete({ _id: req.params.id, profileId });

    if (!item) {
      return res.status(404).json({ success: false, error: 'Inventory item not found.' });
    }

    res.json({ success: true, data: { id: req.params.id } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
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
        recipesPerPage: limit,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/recipes/daily', (req, res) => {
  try {
    if (!recipes.length) {
      return res.json({
        success: true,
        data: [],
      });
    }

    const parsedLimit = Number.parseInt(`${req.query.limit || '4'}`, 10);
    const limit = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 24) : 4;

    // Rotate deterministically per UTC day to keep picks stable for a full day.
    const now = new Date();
    const utcDaySeed = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const dayNumber = Math.floor(utcDaySeed / 86400000);
    const startIndex = dayNumber % recipes.length;

    const dailyRecipes = Array.from({ length: Math.min(limit, recipes.length) }, (_, index) => {
      const recipeIndex = (startIndex + index) % recipes.length;
      return recipes[recipeIndex];
    });

    res.json({
      success: true,
      data: dailyRecipes,
      meta: {
        daySeed: dayNumber,
        startIndex,
      },
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
        error: 'Search query is required',
      });
    }

    const results = recipes.filter(
      (recipe) =>
        recipe.name.toLowerCase().includes(query) ||
        recipe.cuisine.toLowerCase().includes(query) ||
        recipe.ingredients?.some((ing) => ing.toLowerCase().includes(query)),
    );

    res.json({
      success: true,
      data: results,
      count: results.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get recipe by ID
app.get('/api/recipes/:id', (req, res) => {
  try {
    const recipe = recipes.find((r) => r.id === req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        error: 'Recipe not found',
      });
    }

    res.json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all unique cuisines
app.get('/api/cuisines', (req, res) => {
  try {
    const cuisines = [...new Set(recipes.map((r) => r.cuisine))].sort();

    res.json({
      success: true,
      data: cuisines,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Filter by cuisine
app.get('/api/recipes/cuisine/:cuisine', (req, res) => {
  try {
    const cuisine = req.params.cuisine;
    const filtered = recipes.filter((r) => r.cuisine.toLowerCase() === cuisine.toLowerCase());

    res.json({
      success: true,
      data: filtered,
      count: filtered.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Filter by difficulty
app.get('/api/recipes/difficulty/:level', (req, res) => {
  try {
    const level = req.params.level;
    const filtered = recipes.filter((r) => r.difficulty.toLowerCase() === level.toLowerCase());

    res.json({
      success: true,
      data: filtered,
      count: filtered.length,
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

    recipes.forEach((recipe) => {
      cuisineCount[recipe.cuisine] = (cuisineCount[recipe.cuisine] || 0) + 1;
      difficultyCount[recipe.difficulty] = (difficultyCount[recipe.difficulty] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        totalRecipes: recipes.length,
        cuisines: cuisineCount,
        difficulties: difficultyCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/ai/sous-chef
// Handles AI assistant queries with recipe context
app.post('/api/ai/sous-chef', async (req, res) => {
  try {
    const { query, recipeContext } = req.body;

    if (!query) {
      return res.status(400).json({ success: false, message: 'Query is required.' });
    }

    // Check if the API key is actually set
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'dummy_key') {
      return res.status(500).json({
        success: false,
        message: 'Gemini API key is missing. Please add GEMINI_API_KEY to your backend/.env file.',
      });
    }

    // Process context to be readable for the AI
    let contextString = 'No specific recipe context provided.';
    if (recipeContext) {
      const { title, ingredients, directions } = recipeContext;
      const ingredientList = Array.isArray(ingredients)
        ? ingredients.map((i) => i.name || i).join(', ')
        : ingredients;
      const stepList = Array.isArray(directions) ? directions.join(' ') : directions;

      contextString = `
        Recipe Name: ${title || 'Unknown'}
        Ingredients: ${ingredientList || 'Unknown'}
        Instructions: ${stepList || 'Unknown'}
      `;
    }

    const systemPrompt = `You are Claudia, a highly experienced, Michelin-star culinary AI Sous-Chef. 
You are currently helping a user who is looking at the following recipe:
<recipe_context>
${contextString}
</recipe_context>

Guidelines:
1. Provide extremely practical, accurate, and culinary sound advice.
2. Keep your answers concise, friendly, and formatted in clean markdown. 
3. If they ask for a substitution, give exact measurements if possible.
4. If they ask how to make it vegan/gluten-free, provide the specific substitutions for the ingredients listed.
5. Do not include introductory filler like "Sure, I can help with that." Just answer the question directly.`;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(query);
    const aiMessage =
      result.response.text() || 'I am sorry, I am having trouble thinking right now.';

    res.json({
      success: true,
      data: {
        response: aiMessage,
      },
    });
  } catch (error) {
    console.error('AI Sous-Chef Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while communicating with the AI Sous-Chef.',
    });
  }
});

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    res.status(400).json({ success: false, error: error.message });
    return;
  }

  if (error) {
    res.status(400).json({ success: false, error: error.message });
    return;
  }

  next();
});

let serverInstance;

export async function startServer() {
  if (serverInstance) {
    return serverInstance;
  }

  try {
    await connectToDatabase();
    console.log(`✅ MongoDB connected: ${getDatabaseUri()}`);
  } catch (error) {
    console.warn(`⚠️ MongoDB unavailable, starting API without persistence: ${error.message}`);
  }

  serverInstance = app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Serving ${recipes.length} dataset recipes`);
    console.log(`📦 MongoDB-backed user recipes and kitchen inventory enabled when the database is available`);
  });

  return serverInstance;
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export { app };
