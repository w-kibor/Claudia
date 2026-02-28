/**
 * Core recipe-related types for the Claudia project
 */

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  cuisine?: string;
  dishType?: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  tips?: string[];
  calories?: number;
  source?: string;
  tags?: string[];
  rating?: number; // 0-5
  reviewCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  asianAlternative?: string;
  optional: boolean;
}

export interface Instruction {
  id: string;
  step: number;
  description: string;
  timeRequired?: number; // minutes
  equipmentNeeded?: string[];
  notes?: string;
}

export interface RecipeFilter {
  cuisine?: string;
  dishType?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  maxPrepTime?: number;
  maxCookTime?: number;
  servings?: number;
  tags?: string[];
  maxCalories?: number;
  searchTerm?: string;
}

export interface RecipeQuery {
  filters?: RecipeFilter;
  sortBy?: "rating" | "prepTime" | "cookTime" | "newest";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}
