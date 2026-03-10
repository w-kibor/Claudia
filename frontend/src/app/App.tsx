import { useState, useEffect } from 'react';
import Masonry from 'react-responsive-masonry';
import { Sidebar } from './components/Sidebar';
import { RecipeCard, Recipe } from './components/RecipeCard';
import { RecipeDrawer } from './components/RecipeDrawer';
import { KitchenStats } from './components/KitchenStats';
import { FloatingActionButton } from './components/FloatingActionButton';
import { Moon, Sun, Menu, X, Loader2 } from 'lucide-react';
import recipeAPI from './services/api';
import { RecipeCardSkeleton } from './components/RecipeCardSkeleton';

export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
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
      setIsMobile(window.innerWidth < 768);
      // Close mobile sidebar on desktop
      if (window.innerWidth >= 768) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle Theme Synchronization
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div
      className={`h-screen flex flex-col md:flex-row bg-background text-foreground ${isDark ? 'dark' : ''}`}
    >
      {/* Mobile Sidebar Backdrop */}
      {isMobile && isMobileSidebarOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-10 md:hidden'
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Hidden on mobile unless open */}
      <div
        className={`${isMobileSidebarOpen ? 'fixed left-0 top-0 z-20 h-screen' : 'hidden md:flex'}`}
      >
        <Sidebar onClose={() => setIsMobileSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <main className='flex-1 overflow-y-auto bg-background min-h-screen md:min-h-0'>
        {/* Header */}
        <header className='sticky top-0 z-10 h-16 border-b border-border bg-background/80 backdrop-blur-xl'>
          <div className='h-full px-4 md:px-6 flex items-center justify-between gap-4'>
            <div className='flex items-center gap-3 flex-1 min-w-0'>
              {isMobile && (
                <button
                  onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                  className='w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center transition-colors flex-shrink-0'
                >
                  {isMobileSidebarOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
                </button>
              )}
              <div className='min-w-0'>
                <h1 className='text-lg md:text-xl font-semibold truncate'>Recipe Collection</h1>
                <p className='text-xs text-muted-foreground hidden sm:block'>
                  Discover and cook amazing dishes
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className='w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center transition-colors flex-shrink-0'
            >
              {isDark ? <Sun className='w-4 h-4' /> : <Moon className='w-4 h-4' />}
            </button>
          </div>
        </header>

        {/* Content */}
        <div className='p-4 sm:p-6'>
          {/* Kitchen Stats */}
          <div className='mb-6'>
            <KitchenStats />
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
              {recipes.map((recipe) => (
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
        </div>
      </main>

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
