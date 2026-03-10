// API Configuration
const API_BASE_URL = 'http://localhost:3001/api';

// API Service for recipe data
export const recipeAPI = {
  // Getall recipes with pagination
  getRecipes: async (page = 1, limit = 20) => {
    const response = await fetch(`${API_BASE_URL}/recipes?page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch recipes');
    return response.json();
  },

  // Get single recipe by ID
  getRecipeById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/recipes/${id}`);
    if (!response.ok) throw new Error('Recipe not found');
    return response.json();
  },

  // Search recipes
  searchRecipes: async (query: string) => {
    const response = await fetch(`${API_BASE_URL}/recipes/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Search failed');
    return response.json();
  },

  // Get all cuisines
  getCuisines: async () => {
    const response = await fetch(`${API_BASE_URL}/cuisines`);
    if (!response.ok) throw new Error('Failed to fetch cuisines');
    return response.json();
  },

  // Filter by cuisine
  getRecipesByCuisine: async (cuisine: string) => {
    const response = await fetch(`${API_BASE_URL}/recipes/cuisine/${cuisine}`);
    if (!response.ok) throw new Error('Failed to filter by cuisine');
    return response.json();
  },

  // Filter by difficulty
  getRecipesByDifficulty: async (difficulty: string) => {
    const response = await fetch(`${API_BASE_URL}/recipes/difficulty/${difficulty}`);
    if (!response.ok) throw new Error('Failed to filter by difficulty');
    return response.json();
  },

  // Get stats
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  // AI Sous-Chef Integration
  askSousChef: async (query: string, recipeContext: any) => {
    const response = await fetch(`${API_BASE_URL}/ai/sous-chef`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, recipeContext }),
    });

    // Specifically catch 500 errors to show API key missing warnings nicely
    if (!response.ok && response.status !== 500) {
      throw new Error('Failed to get answer from Sous-Chef');
    }

    return response.json();
  }
};

export default recipeAPI;
