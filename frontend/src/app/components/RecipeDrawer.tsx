import { X, Clock, Users, ChefHat, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Recipe } from './RecipeCard';
import { useState, useMemo } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RecipeDrawerProps {
  recipe: Recipe | null;
  onClose: () => void;
}

export function RecipeDrawer({ recipe, onClose }: RecipeDrawerProps) {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());
  const [chatMessage, setChatMessage] = useState('');

  // Transform ingredients array to the format needed for the UI
  const ingredients = useMemo(() => {
    if (!recipe?.ingredients) return [];
    return recipe.ingredients.map((ingredient, index) => ({
      id: `ing-${index}`,
      name: ingredient,
    }));
  }, [recipe?.ingredients]);

  // Transform directions array to the format needed for the UI
  const steps = useMemo(() => {
    if (!recipe?.directions) return [];
    return recipe.directions.map((direction, index) => ({
      id: `step-${index}`,
      instruction: direction,
    }));
  }, [recipe?.directions]);

  const handleCheckIngredient = (id: string) => {
    setCheckedIngredients(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <AnimatePresence>
      {recipe && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-screen w-full md:w-[60%] lg:w-[50%] bg-background z-40 shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Sticky Hero Header */}
            <div className="relative h-48 sm:h-64 md:h-80 flex-shrink-0">
              <ImageWithFallback
                src={recipe.image}
                alt={recipe.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-3 sm:top-4 right-3 sm:right-4 w-10 h-10 sm:w-10 sm:h-10 rounded-full bg-background/90 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-accent transition-colors active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Recipe Title */}
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2 line-clamp-2 text-white">{recipe.name}</h1>
                <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-white/90 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{recipe.prepTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ChefHat className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{recipe.difficulty}</span>
                  </div>
                  {recipe.cuisine && (
                    <div className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs">
                      {recipe.cuisine}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 pb-32">
                {/* Interactive Ingredients */}
                <section>
                  <h2 className="text-xl sm:text-2xl mb-4 font-semibold text-foreground">Ingredients</h2>
                  {ingredients.length > 0 ? (
                    <div className="space-y-2">
                      {ingredients.map((ingredient) => (
                        <label
                          key={ingredient.id}
                          className="flex items-center gap-3 p-2 sm:p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
                        >
                          <Checkbox.Root
                            checked={checkedIngredients.has(ingredient.id)}
                            onCheckedChange={() => handleCheckIngredient(ingredient.id)}
                            className="w-5 h-5 rounded border-2 border-border bg-background flex items-center justify-center data-[state=checked]:bg-accent data-[state=checked]:border-accent transition-all flex-shrink-0"
                          >
                            <Checkbox.Indicator>
                              <Check className="w-3.5 h-3.5 text-accent-foreground" />
                            </Checkbox.Indicator>
                          </Checkbox.Root>
                          <span
                            className={`flex-1 text-sm sm:text-base ${checkedIngredients.has(ingredient.id)
                                ? 'line-through text-muted-foreground'
                                : 'text-foreground'
                              }`}
                          >
                            {ingredient.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No ingredients available</p>
                  )}
                </section>

                {/* Step-by-Step Instructions */}
                <section>
                  <h2 className="text-xl sm:text-2xl mb-4 font-semibold text-foreground">Instructions</h2>
                  {steps.length > 0 ? (
                    <div className="space-y-4 sm:space-y-6">
                      {steps.map((step, index) => (
                        <div key={step.id} className="flex gap-3 sm:gap-4">
                          <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center flex-shrink-0 font-medium text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1 pt-1">
                            <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                              {step.instruction}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No instructions available</p>
                  )}
                </section>
              </div>
            </div>

            {/* AI Sous-Chef Chat - Fixed at bottom */}
            <div className="absolute bottom-0 left-0 right-0 bg-card border-t border-border p-3 sm:p-4 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs text-muted-foreground">AI Sous-Chef ready to help</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ask to modify ingredients..."
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
                <button className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors flex items-center justify-center flex-shrink-0">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
