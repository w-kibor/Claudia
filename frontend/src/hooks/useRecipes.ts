/**
 * React hook for fetching recipes
 * Integrates with TanStack Query for data fetching
 */

import { useState, useCallback } from "react";
import { Recipe, RecipeQuery } from "@/lib/types/recipe";

interface UseFetchRecipesReturn {
  recipes: Recipe[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch recipes from the backend
 * Future integration with TanStack Query
 */
export const useFetchRecipes = (
  query?: RecipeQuery
): UseFetchRecipesReturn => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query || {}),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch recipes: ${response.statusText}`);
      }

      const data = await response.json();
      setRecipes(data.recipes || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [query]);

  return { recipes, loading, error, refetch: fetchRecipes };
};

/**
 * Hook to fetch a single recipe by ID
 */
export const useFetchRecipe = (id: string | null) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchRecipe = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/recipes/${id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch recipe: ${response.statusText}`);
      }

      const data = await response.json();
      setRecipe(data.recipe);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [id]);

  return { recipe, loading, error, refetch: fetchRecipe };
};
