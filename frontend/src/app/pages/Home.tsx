import { useEffect, useState } from 'react';
import Masonry from 'react-responsive-masonry';
import { RecipeCard, Recipe } from '../components/RecipeCard';
import { RecipeDrawer } from '../components/RecipeDrawer';
import { RecipeCardSkeleton } from '../components/RecipeCardSkeleton';
import recipeAPI from '../services/api';
import { ChefHat } from 'lucide-react';

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  // Get responsive column count
  const getColumnCount = () => {
    if (window.innerWidth < 640) return 1; // sm
    if (window.innerWidth < 1024) return 2; // md
    if (window.innerWidth < 1280) return 3; // lg
    return 4; // xl
  };
  const [columnCount, setColumnCount] = useState(getColumnCount());

  // Fetch some recipes for the "Today's Recipes" motivation section
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        // Let's just fetch the first page for motivation
        const response = await recipeAPI.getRecipes(1, 4); 
        if (response.success && response.data) {
          setRecipes(response.data);
        }
      } catch (err) {
        console.error('Error fetching recipes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setColumnCount(getColumnCount());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className='p-4 sm:p-6 lg:p-8 space-y-12'>
      {/* Hero Section */}
      <section className='relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 via-primary/5 to-background border border-border p-8 md:p-12'>
        <div className='relative z-10 max-w-2xl'>
          <h1 className='text-3xl md:text-5xl font-bold mb-4 tracking-tight'>
            Welcome to <span className='text-primary'>Claudia</span>
          </h1>
          <p className='text-lg text-muted-foreground mb-8'>
            Your personal AI-powered cooking companion. Discover new recipes, manage your kitchen inventory, and get inspired every day.
          </p>
          <div className='flex gap-4'>
            <a href="/ask-ai" className='px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2'>
              <ChefHat className='w-5 h-5' />
              Ask AI for Ideas
            </a>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className='absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-primary/10 to-transparent pointer-events-none' />
      </section>

      {/* Today's Recipes Section */}
      <section>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h2 className='text-2xl font-semibold tracking-tight'>Today's Recipes to Motivate You!</h2>
            <p className='text-muted-foreground'>Handpicked selections just for today</p>
          </div>
        </div>
        
        {loading ? (
          <Masonry columnsCount={columnCount} gutter='1.5rem'>
            {Array.from({ length: 4 }).map((_, i) => (
              <RecipeCardSkeleton key={`skeleton-${i}`} />
            ))}
          </Masonry>
        ) : recipes.length > 0 ? (
          <Masonry columnsCount={columnCount} gutter='1.5rem'>
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
              />
            ))}
          </Masonry>
        ) : (
          <div className='p-12 text-center text-muted-foreground border border-border rounded-xl bg-card'>
            No motivational recipes found right now. Check back later!
          </div>
        )}
      </section>

      <RecipeDrawer
        recipe={selectedRecipe}
        isOpen={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />
    </div>
  );
}
