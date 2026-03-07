import { X, Clock, Users, Flame, Info, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Recipe } from './RecipeCard';
import { useState, useMemo, useRef, useEffect } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { ImageWithFallback } from './figma/ImageWithFallback';
import recipeAPI from '../services/api';
import ReactMarkdown from 'react-markdown';

interface RecipeDrawerProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function RecipeDrawer({ recipe, isOpen, onClose }: RecipeDrawerProps) {
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat when new messages appear
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  if (!recipe || !isOpen) return null;

  // Transform ingredients array to the format needed for the UI
  const ingredients = useMemo(() => {
    if (!recipe?.ingredients) return [];
    return recipe.ingredients.map((ingredient: any, index: number) => ({
      id: `ing-${index}`,
      name: ingredient,
    }));
  }, [recipe?.ingredients]);

  // Transform directions array to the format needed for the UI
  const steps = useMemo(() => {
    const rawDirections = recipe?.instructions || recipe?.directions;
    if (!rawDirections) return [];
    return rawDirections.map((direction: any, index: number) => {
      return {
        id: `step-${index}`,
        instruction: direction,
      };
    });
  }, [recipe?.directions, recipe?.instructions]);

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

  const handleChatSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isThinking) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsThinking(true);

    try {
      // Build minimal context from recipe
      const recipeContext = {
        title: recipe.name,
        ingredients: recipe.ingredients || [],
        directions: recipe.instructions || recipe.directions || []
      };

      const result = await recipeAPI.askSousChef(userMsg, recipeContext);

      if (result.success && result.data?.response) {
        setMessages(prev => [...prev, { role: 'assistant', content: result.data.response }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an issue getting that answer.' }]);
      }
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : 'I had trouble connecting to my cloud kitchen.';
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `**Error:** ${errMessage}\n\n*Did you forget to add your OpenAI API key to backend/.env?*`
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <AnimatePresence>
      {recipe && isOpen && (
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
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2 line-clamp-2">{recipe.name}</h1>
                <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{recipe.prepTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
                  <h2 className="text-xl sm:text-2xl mb-4 font-semibold">Ingredients</h2>
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
                              : ''
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
                  <h2 className="text-xl sm:text-2xl mb-4 font-semibold">Instructions</h2>
                  {steps.length > 0 ? (
                    <div className="space-y-4 sm:space-y-6">
                      {steps.map((step: any, index: number) => (
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
            <div className="absolute bottom-0 left-0 right-0 bg-card border-t border-border flex flex-col backdrop-blur-md" style={{ maxHeight: '40vh' }}>

              {/* Chat History Area */}
              {messages.length > 0 && (
                <div
                  ref={chatScrollRef}
                  className="flex-1 overflow-y-auto w-full p-4 space-y-4 bg-muted/30 border-b border-border text-sm"
                  style={{ maxHeight: '250px' }}
                >
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2 ${msg.role === 'user'
                          ? 'bg-accent text-accent-foreground rounded-br-sm'
                          : 'bg-background border border-border text-foreground rounded-bl-sm prose prose-sm dark:prose-invert max-w-none'
                          }`}
                      >
                        {msg.role === 'user' ? (
                          msg.content
                        ) : (
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        )}
                      </div>
                    </div>
                  ))}

                  {isThinking && (
                    <div className="flex items-start">
                      <div className="bg-background border border-border text-foreground rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-accent animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Chat Input Area */}
              <div className="p-3 sm:p-4 bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${isThinking ? 'bg-amber-500 animate-pulse' : 'bg-accent'}`} />
                  <span className="text-xs text-muted-foreground">
                    {isThinking ? 'AI Sous-Chef is thinking...' : 'AI Sous-Chef ready to help'}
                  </span>
                </div>
                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask how to make this vegan..."
                    className="flex-1 bg-muted border-none rounded-xl px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 placeholder:text-muted-foreground/70"
                    disabled={isThinking}
                  />
                  <button
                    type="submit"
                    disabled={isThinking || !chatInput.trim()}
                    className="px-4 py-2 bg-accent text-accent-foreground rounded-xl text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
                  >
                    Ask
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
