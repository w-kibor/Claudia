# Claudia Backend API

Express.js REST API serving recipe data for the Claudia platform.

## Features

- ✅ RESTful API endpoints
- ✅ CORS enabled for frontend integration
- ✅ Search functionality
- ✅ Filter by cuisine and difficulty
- ✅ Pagination support
- ✅ Statistics endpoint
- ✅ MongoDB persistence for user recipes and kitchen inventory
- ✅ Image upload support for recipes and inventory items

## Setup

```bash
# Install dependencies
npm install

# Optional local environment
export MONGODB_URI=mongodb://127.0.0.1:27017/claudia
export DEFAULT_PROFILE_ID=demo-user

# Start server
npm start

# Start with auto-reload (Node 18+)
npm run dev
```

## API Endpoints

### Base URL

```
http://localhost:3001
```

### Endpoints

- `GET /` - API information
- `GET /api/recipes` - Get all recipes (paginated)
  - Query params: `page`, `limit`
- `GET /api/recipes/:id` - Get specific recipe
- `GET /api/recipes/search?q=query` - Search recipes
- `GET /api/cuisines` - Get all available cuisines
- `GET /api/recipes/cuisine/:cuisine` - Filter by cuisine
- `GET /api/recipes/difficulty/:level` - Filter by difficulty (Easy/Medium/Hard)
- `GET /api/stats` - Get statistics
- `GET /api/user/summary` - Get MongoDB-backed kitchen summary
- `GET /api/user/recipes` - List uploaded recipes for the current profile
- `POST /api/user/recipes` - Upload a recipe with optional image
- `GET /api/user/inventory` - List fridge and pantry inventory
- `POST /api/user/inventory` - Add an inventory item with optional image

### Response Format

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 50,
    "totalRecipes": 1000,
    "recipesPerPage": 20
  }
}
```

## Data Source

- Dataset recipes load from `backend/data/recipes_small.json`
- User recipes and inventory persist in MongoDB
- Uploaded images are served from `backend/uploads/`

## Port

Default: `3001` (configurable via `PORT` environment variable)
