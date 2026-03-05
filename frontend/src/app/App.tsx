import { useState, useEffect } from 'react';
import Masonry from 'react-responsive-masonry';
import { Sidebar } from './components/Sidebar';
import { RecipeCard, Recipe } from './components/RecipeCard';
import { RecipeDrawer } from './components/RecipeDrawer';
import { KitchenStats } from './components/KitchenStats';
import { FloatingActionButton } from './components/FloatingActionButton';
import { RecipeFilters } from './components/RecipeFilters';
import { Moon, Sun, Menu, X, Loader2 } from 'lucide-react';
import recipeAPI from './services/api';

export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCuisine, setActiveCuisine] = useState<string | null>(null);
  const [activeDifficulty, setActiveDifficulty] = useState<string | null>(null);
  const [availableCuisines, setAvailableCuisines] = useState<string[]>([]);
  const availableDifficulties = ['Easy', 'Medium', 'Hard'];

  // Get responsive column count
  const getColumnCount = () => {
    if (window.innerWidth < 640) return 1; // sm
    if (window.innerWidth < 1024) return 2; // md
    if (window.innerWidth < 1280) return 3; // lg
    return 4; // xl
  };

  const [columnCount, setColumnCount] = useState(getColumnCount());

  // Fetch recipes and filter data from API
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch recipes and cuisines in parallel
        const [recipesRes, cuisinesRes] = await Promise.all([
          recipeAPI.getRecipes(1, 100),
          recipeAPI.getCuisines()
        ]);

        if (recipesRes.success && recipesRes.data) {
          setRecipes(recipesRes.data);
        }

        if (cuisinesRes.success && cuisinesRes.data) {
          // Filter out null/empty cuisines
          setAvailableCuisines(cuisinesRes.data.filter(Boolean));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Error fetching initial data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Handle Filtering and Searching
  useEffect(() => {
    const fetchFilteredRecipes = async () => {
      try {
        setLoading(true);
        setError(null);

        let result;

        if (searchQuery) {
          result = await recipeAPI.searchRecipes(searchQuery);
        } else if (activeCuisine) {
          result = await recipeAPI.getRecipesByCuisine(activeCuisine);
        } else if (activeDifficulty) {
          result = await recipeAPI.getRecipesByDifficulty(activeDifficulty);
        } else {
          // Load default if no filters
          result = await recipeAPI.getRecipes(1, 100);
        }

        if (result.success && result.data) {
          // If we have multiple filters active, we do client-side filtering on the returned list 
          // because the API endpoints currently only support one filter type at a time
          let filteredData = result.data;

          if (!searchQuery && activeCuisine && activeDifficulty) {
            filteredData = filteredData.filter((r: Recipe) => r.difficulty === activeDifficulty);
          }

          setRecipes(filteredData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Filter fetch failed');
        console.error('Error fetching filtered recipes:', err);
      } finally {
        setLoading(false);
      }
    };

    // Don't run on initial mount to avoid double fetching
    if (searchQuery !== '' || activeCuisine !== null || activeDifficulty !== null) {
      fetchFilteredRecipes();
    } else {
      // Re-fetch default if all filters cleared
      const fetchDefault = async () => {
        setLoading(true);
        try {
          const res = await recipeAPI.getRecipes(1, 100);
          if (res.success && res.data) setRecipes(res.data);
        } catch (e) { }
        setLoading(false);
      };
      // Only if not initial load
      if (!loading && recipes.length < 100) fetchDefault();
    }
  }, [searchQuery, activeCuisine, activeDifficulty]);

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

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`h-screen flex flex-col md:flex-row ${isDark ? 'dark' : ''}`}>
      {/* Mobile Sidebar Backdrop */}
      {isMobile && isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Hidden on mobile unless open */}
      <div className={`${isMobileSidebarOpen ? 'fixed left-0 top-0 z-20 h-screen' : 'hidden md:flex'}`}>
        <Sidebar onClose={() => setIsMobileSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-background min-h-screen md:min-h-0">
        {/* Header */}
        <header className="sticky top-0 z-10 h-16 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="h-full px-4 md:px-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {isMobile && (
                <button
                  onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                  className="w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center transition-colors flex-shrink-0"
                >
                  {isMobileSidebarOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              )}
              <div className="min-w-0">
                <h1 className="text-lg md:text-xl font-semibold truncate">Recipe Collection</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Discover and cook amazing dishes
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center transition-colors flex-shrink-0"
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Kitchen Stats */}
          <div className="mb-6">
            <KitchenStats />
          </div>

          {/* Search & Filters */}
          <RecipeFilters
            onSearch={setSearchQuery}
            onFilterCuisine={setActiveCuisine}
            onFilterDifficulty={setActiveDifficulty}
            cuisines={availableCuisines}
            difficulties={availableDifficulties}
          />

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-primary" />
                <p className="text-sm text-muted-foreground">Loading recipes...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center p-6 max-w-md">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-3">
                  <X className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Failed to load recipes</h3>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Masonry Grid */}
          {!loading && !error && recipes.length > 0 && (
            <Masonry columnsCount={columnCount} gutter="1.5rem">
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
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <p className="text-muted-foreground">No recipes found</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Recipe Drawer */}
      <RecipeDrawer
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />

      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
}
