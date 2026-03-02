# Claudia Backend API

Express.js REST API serving recipe data for the Claudia platform.

## Features

- ✅ RESTful API endpoints
- ✅ CORS enabled for frontend integration
- ✅ Search functionality
- ✅ Filter by cuisine and difficulty
- ✅ Pagination support
- ✅ Statistics endpoint

## Setup

```bash
# Install dependencies
npm install

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

Loads from: `../data-pipeline/clean/recipes_sample.json`

## Port

Default: `3001` (configurable via `PORT` environment variable)
