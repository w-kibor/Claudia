import { useState } from 'react';
import Masonry from 'react-responsive-masonry';
import { Sidebar } from './components/Sidebar';
import { RecipeCard, Recipe } from './components/RecipeCard';
import { RecipeDrawer } from './components/RecipeDrawer';
import { KitchenStats } from './components/KitchenStats';
import { FloatingActionButton } from './components/FloatingActionButton';
import { Moon, Sun } from 'lucide-react';

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

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`h-screen flex ${isDark ? 'dark' : ''}`}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-background">
        {/* Header */}
        <header className="sticky top-0 z-10 h-16 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="h-full px-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl">Recipe Collection</h1>
              <p className="text-xs text-muted-foreground">
                Discover and cook amazing dishes
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
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
        <div className="p-6">
          {/* Kitchen Stats */}
          <div className="mb-6">
            <KitchenStats />
          </div>

          {/* Masonry Grid */}
          <Masonry columnsCount={4} gutter="1.5rem">
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
