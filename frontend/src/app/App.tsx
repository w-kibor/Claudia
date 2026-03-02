import { useState, useEffect } from 'react';
import Masonry from 'react-responsive-masonry';
import { Sidebar } from './components/Sidebar';
import { RecipeCard, Recipe } from './components/RecipeCard';
import { RecipeDrawer } from './components/RecipeDrawer';
import { KitchenStats } from './components/KitchenStats';
import { FloatingActionButton } from './components/FloatingActionButton';
import { Moon, Sun, Menu, X } from 'lucide-react';

const mockRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Truffle Pasta Carbonara',
    image: 'https://images.unsplash.com/photo-1763627719097-a923a1e703a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwcGFzdGElMjBkaXNoJTIwZm9vZCUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc3MjQzODk3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: '25 min',
    difficulty: 'Medium',
    cuisine: 'Italian',
  },
  {
    id: '2',
    name: 'Mediterranean Quinoa Bowl',
    image: 'https://images.unsplash.com/photo-1605034298551-baacf17591d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNhbGFkJTIwYm93bCUyMGhlYWx0aHklMjBmb29kfGVufDF8fHx8MTc3MjQzODk3N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: '15 min',
    difficulty: 'Easy',
    cuisine: 'Mediterranean',
  },
  {
    id: '3',
    name: 'Artisan Sourdough Bread',
    image: 'https://images.unsplash.com/photo-1767065887724-4f6ba9464b66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc2FuJTIwYnJlYWQlMjBiYWtpbmclMjBydXN0aWN8ZW58MXx8fHwxNzcyNDM4OTc3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: '24 hrs',
    difficulty: 'Hard',
    cuisine: 'French',
  },
  {
    id: '4',
    name: 'Dark Chocolate Lava Cake',
    image: 'https://images.unsplash.com/photo-1737700088028-fae0666feb83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBkZXNzZXJ0JTIwY2FrZSUyMGVsZWdhbnR8ZW58MXx8fHwxNzcyNDM4OTc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: '30 min',
    difficulty: 'Medium',
    cuisine: 'French',
  },
  {
    id: '5',
    name: 'Omakase Sushi Platter',
    image: 'https://images.unsplash.com/photo-1769031407163-2bd4d9e5c035?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMHBsYXR0ZXIlMjBqYXBhbmVzZSUyMGN1aXNpbmV8ZW58MXx8fHwxNzcyNDE1OTEwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: '45 min',
    difficulty: 'Hard',
    cuisine: 'Japanese',
  },
  {
    id: '6',
    name: 'Wagyu Steak with Chimichurri',
    image: 'https://images.unsplash.com/photo-1758157835975-1cb4947750df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc3RlYWslMjBkaW5uZXIlMjBwcmVtaXVtfGVufDF8fHx8MTc3MjQzODk3OHww&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: '20 min',
    difficulty: 'Medium',
    cuisine: 'Argentinian',
  },
  {
    id: '7',
    name: 'Açaí Superfood Bowl',
    image: 'https://images.unsplash.com/photo-1625480499375-27220a672237?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbW9vdGhpZSUyMGJvd2wlMjBjb2xvcmZ1bCUyMGJyZWFrZmFzdHxlbnwxfHx8fDE3NzI0Mzg5Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: '10 min',
    difficulty: 'Easy',
    cuisine: 'Brazilian',
  },
  {
    id: '8',
    name: 'Neapolitan Margherita Pizza',
    image: 'https://images.unsplash.com/photo-1680405620826-83b0f0f61b28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMG1hcmdoZXJpdGElMjBpdGFsaWFuJTIwZm9vZHxlbnwxfHx8fDE3NzIzNDczNTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: '35 min',
    difficulty: 'Medium',
    cuisine: 'Italian',
  },
];

export default function App() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Get responsive column count
  const getColumnCount = () => {
    if (window.innerWidth < 640) return 1; // sm
    if (window.innerWidth < 1024) return 2; // md
    if (window.innerWidth < 1280) return 3; // lg
    return 4; // xl
  };

  const [columnCount, setColumnCount] = useState(getColumnCount());

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

          {/* Masonry Grid */}
          <Masonry columnsCount={columnCount} gutter="1rem sm:1.5rem">
            {mockRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
              />
            ))}
          </Masonry>
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
