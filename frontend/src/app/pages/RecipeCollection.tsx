import { useState, useEffect } from 'react';
import Masonry from 'react-responsive-masonry';
import { RecipeCard, Recipe } from '../components/RecipeCard';
import { RecipeDrawer } from '../components/RecipeDrawer';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { X } from 'lucide-react';
import recipeAPI from '../services/api';
import { RecipeCardSkeleton } from '../components/RecipeCardSkeleton';

export default function RecipeCollection() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get responsive column count
  const getColumnCount = () => {
    if (window.innerWidth < 640) return 1; // sm
    if (window.innerWidth < 1024) return 2; // md
    if (window.innerWidth < 1280) return 3; // lg
    return 4; // xl
  };

  const [columnCount, setColumnCount] = useState(getColumnCount());

  // Fetch recipes from API
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await recipeAPI.getRecipes(1, 100); // Load first 100 recipes
        if (response.success && response.data) {
          setRecipes(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load recipes');
        console.error('Error fetching recipes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setColumnCount(getColumnCount());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className='p-4 sm:p-6'>
      <div className='mb-6'>
        <h2 className='text-xl md:text-2xl font-semibold mb-2'>Dataset Recipes</h2>
        <p className='text-sm text-muted-foreground mb-4'>Browse the complete collection of recipes</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className='flex items-center justify-center min-h-[400px]'>
          <div className='text-center w-full'>
            <Masonry columnsCount={columnCount} gutter='1.5rem'>
              {Array.from({ length: columnCount === 1 ? 4 : 8 }).map((_, i) => (
                <RecipeCardSkeleton key={`skeleton-${i}`} />
              ))}
            </Masonry>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className='flex items-center justify-center min-h-[400px]'>
          <div className='text-center p-6 max-w-md'>
            <div className='w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-3'>
              <X className='w-6 h-6 text-destructive' />
            </div>
            <h3 className='text-lg font-semibold mb-2'>Failed to load recipes</h3>
            <p className='text-sm text-muted-foreground mb-4'>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className='px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Masonry Grid */}
      {!loading && !error && recipes.length > 0 && (
        <Masonry columnsCount={columnCount} gutter='1.5rem'>
          {recipes.map((recipe: Recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => setSelectedRecipe(recipe)}
            />
          ))}
        </Masonry>
      )}

      {/* Empty State */}
      {!loading && !error && recipes.length === 0 && (
        <div className='flex items-center justify-center min-h-[400px]'>
          <div className='text-center'>
            <p className='text-muted-foreground'>No recipes found</p>
          </div>
        </div>
      )}

      {/* Recipe Drawer */}
      <RecipeDrawer
        recipe={selectedRecipe}
        isOpen={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />

      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
}
