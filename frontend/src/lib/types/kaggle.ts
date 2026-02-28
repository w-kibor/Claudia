/**
 * Kaggle Dataset-related types
 */

export interface KaggleRecipeRaw {
  name?: string;
  title?: string;
  recipe_name?: string;
  description?: string;
  prep_time?: number | string;
  preptime?: number | string;
  cook_time?: number | string;
  cooktime?: number | string;
  servings?: number | string;
  difficulty?: string;
  cuisine?: string;
  category?: string;
  dish_type?: string;
  ingredients?: string | string[];
  instructions?: string | string[];
  tags?: string | string[];
  rating?: number | string;
  image_url?: string;
  imageurl?: string;
  image?: string;
  url?: string;
  source?: string;
  calories?: number | string;
  nutrition?: string;
}

export interface DataPipelineConfig {
  input: string; // Path to raw CSV
  output: string; // Path to output JSON
  database?: {
    type: "mysql" | "postgres" | "sqlite";
    url: string;
    database: string;
  };
}
