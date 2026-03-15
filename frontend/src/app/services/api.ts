// API Configuration
const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001').replace(/\/$/, '');
const API_BASE_URL = `${API_ORIGIN}/api`;
const DEFAULT_PROFILE_ID = import.meta.env.VITE_PROFILE_ID || 'demo-user';

export interface InventorySummary {
  onHand: number;
  missing: number;
  total: number;
}

export interface KitchenSummaryResponse {
  profileId: string;
  ownRecipes: number;
  inventory: InventorySummary;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  location: 'Fridge' | 'Pantry' | 'Freezer';
  status: 'available' | 'running-low' | 'needed';
  notes?: string;
  expiresAt?: string | null;
  image: string;
  createdAt: string;
}

const parseJSON = async (response: Response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw new Error(data.error || data.message || 'Request failed');
  }

  return data;
};

const withProfileId = (formData: FormData) => {
  if (!formData.get('profileId')) {
    formData.append('profileId', DEFAULT_PROFILE_ID);
  }

  return formData;
};

// API Service for recipe data
export const recipeAPI = {
  // Getall recipes with pagination
  getRecipes: async (page = 1, limit = 20) => {
    const response = await fetch(`${API_BASE_URL}/recipes?page=${page}&limit=${limit}`);
    return parseJSON(response);
  },

  // Get single recipe by ID
  getRecipeById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/recipes/${id}`);
    return parseJSON(response);
  },

  // Search recipes
  searchRecipes: async (query: string) => {
    const response = await fetch(`${API_BASE_URL}/recipes/search?q=${encodeURIComponent(query)}`);
    return parseJSON(response);
  },

  // Get all cuisines
  getCuisines: async () => {
    const response = await fetch(`${API_BASE_URL}/cuisines`);
    return parseJSON(response);
  },

  // Filter by cuisine
  getRecipesByCuisine: async (cuisine: string) => {
    const response = await fetch(`${API_BASE_URL}/recipes/cuisine/${cuisine}`);
    return parseJSON(response);
  },

  // Filter by difficulty
  getRecipesByDifficulty: async (difficulty: string) => {
    const response = await fetch(`${API_BASE_URL}/recipes/difficulty/${difficulty}`);
    return parseJSON(response);
  },

  // Get stats
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/stats`);
    return parseJSON(response);
  },

  getKitchenSummary: async (profileId = DEFAULT_PROFILE_ID) => {
    const response = await fetch(`${API_BASE_URL}/user/summary?profileId=${encodeURIComponent(profileId)}`);
    return parseJSON(response);
  },

  getUserRecipes: async (profileId = DEFAULT_PROFILE_ID) => {
    const response = await fetch(`${API_BASE_URL}/user/recipes?profileId=${encodeURIComponent(profileId)}`);
    return parseJSON(response);
  },

  createUserRecipe: async (formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/user/recipes`, {
      method: 'POST',
      body: withProfileId(formData),
    });

    return parseJSON(response);
  },

  getInventoryItems: async (profileId = DEFAULT_PROFILE_ID) => {
    const response = await fetch(`${API_BASE_URL}/user/inventory?profileId=${encodeURIComponent(profileId)}`);
    return parseJSON(response);
  },

  createInventoryItem: async (formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/user/inventory`, {
      method: 'POST',
      body: withProfileId(formData),
    });

    return parseJSON(response);
  },

  updateInventoryItem: async (id: string, formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/user/inventory/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: withProfileId(formData),
    });

    return parseJSON(response);
  },

  deleteInventoryItem: async (id: string, profileId = DEFAULT_PROFILE_ID) => {
    const response = await fetch(
      `${API_BASE_URL}/user/inventory/${encodeURIComponent(id)}?profileId=${encodeURIComponent(profileId)}`,
      { method: 'DELETE' },
    );

    return parseJSON(response);
  },

  updateUserRecipe: async (id: string, formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/user/recipes/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: withProfileId(formData),
    });

    return parseJSON(response);
  },

  deleteUserRecipe: async (id: string, profileId = DEFAULT_PROFILE_ID) => {
    const response = await fetch(
      `${API_BASE_URL}/user/recipes/${encodeURIComponent(id)}?profileId=${encodeURIComponent(profileId)}`,
      { method: 'DELETE' },
    );

    return parseJSON(response);
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
  },
};

export default recipeAPI;
