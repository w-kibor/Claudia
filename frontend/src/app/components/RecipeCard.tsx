import { Clock, TrendingUp } from 'lucide-react';

export interface Recipe {
  id: string;
  name: string;
  image: string;
  prepTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  const difficultyColor = {
    Easy: 'bg-lime-500/80',
    Medium: 'bg-amber-500/80',
    Hard: 'bg-rose-500/80'
  };

  return (
    <div 
      onClick={onClick}
      className="group relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
    >
      {/* Image */}
      <div className="aspect-[4/5] overflow-hidden bg-muted">
        <img 
          src={recipe.image} 
          alt={recipe.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Info Overlay - Always visible at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 backdrop-blur-md bg-black/40 border-t border-white/10">
        <div className="flex items-center justify-between gap-2 text-white text-xs">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{recipe.prepTime}</span>
          </div>
          <div className={`px-2 py-0.5 rounded-full text-white ${difficultyColor[recipe.difficulty]}`}>
            {recipe.difficulty}
          </div>
        </div>
      </div>

      {/* Recipe Name - appears on hover */}
      <div className="absolute inset-x-0 bottom-16 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-white text-xl drop-shadow-lg">{recipe.name}</h3>
        <p className="text-white/80 text-sm mt-1">{recipe.cuisine}</p>
      </div>

      {/* Quick Add Button */}
      <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg">
        <TrendingUp className="w-4 h-4" />
      </button>
    </div>
  );
}
