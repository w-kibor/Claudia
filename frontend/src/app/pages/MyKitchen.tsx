import * as Tabs from '@radix-ui/react-tabs';
import { useEffect, useState } from 'react';
import { ChefHat, Bookmark, Package, Plus, RefreshCw } from 'lucide-react';
import { KitchenStats } from '../components/KitchenStats';
import { RecipeCard, type Recipe } from '../components/RecipeCard';
import { RecipeDrawer } from '../components/RecipeDrawer';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import recipeAPI, {
  type InventoryItem,
  type KitchenSummaryResponse,
} from '../services/api';

const emptySummary: KitchenSummaryResponse = {
  profileId: 'demo-user',
  ownRecipes: 0,
  inventory: {
    onHand: 0,
    missing: 0,
    total: 0,
  },
};

function formatExpiryDate(value?: string | null) {
  if (!value) {
    return 'No expiry date';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'No expiry date';
  }

  return date.toLocaleDateString();
}

function formatStatusLabel(status: InventoryItem['status']) {
  switch (status) {
    case 'running-low':
      return 'Running Low';
    case 'needed':
      return 'Need to Buy';
    default:
      return 'Available';
  }
}

export default function MyKitchen() {
  const [summary, setSummary] = useState<KitchenSummaryResponse>(emptySummary);
  const [ownRecipes, setOwnRecipes] = useState<Recipe[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recipeNotice, setRecipeNotice] = useState<string | null>(null);
  const [inventoryNotice, setInventoryNotice] = useState<string | null>(null);
  const [recipeSubmitting, setRecipeSubmitting] = useState(false);
  const [inventorySubmitting, setInventorySubmitting] = useState(false);

  const loadKitchenData = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      setError(null);

      const [summaryResponse, recipeResponse, inventoryResponse] = await Promise.all([
        recipeAPI.getKitchenSummary(),
        recipeAPI.getUserRecipes(),
        recipeAPI.getInventoryItems(),
      ]);

      setSummary(summaryResponse.data);
      setOwnRecipes(recipeResponse.data);
      setInventoryItems(inventoryResponse.data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load your kitchen');
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    void loadKitchenData();
  }, []);

  const handleRecipeSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    try {
      setRecipeSubmitting(true);
      setRecipeNotice(null);

      const result = await recipeAPI.createUserRecipe(new FormData(form));

      form.reset();
      setRecipeNotice(`Saved ${result.data.name} to your recipe collection.`);
      await loadKitchenData(false);
    } catch (submitError) {
      setRecipeNotice(submitError instanceof Error ? submitError.message : 'Failed to save recipe');
    } finally {
      setRecipeSubmitting(false);
    }
  };

  const handleInventorySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    try {
      setInventorySubmitting(true);
      setInventoryNotice(null);

      const result = await recipeAPI.createInventoryItem(new FormData(form));

      form.reset();
      setInventoryNotice(`Added ${result.data.name} to your kitchen inventory.`);
      await loadKitchenData(false);
    } catch (submitError) {
      setInventoryNotice(
        submitError instanceof Error ? submitError.message : 'Failed to save inventory item',
      );
    } finally {
      setInventorySubmitting(false);
    }
  };

  return (
    <div className='p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold tracking-tight mb-2'>My Kitchen</h1>
        <p className='text-muted-foreground text-lg'>Save your own recipes, upload food photos, and keep track of what is in your fridge or pantry.</p>
      </div>

      <div className='grid gap-4 lg:grid-cols-[1.3fr,0.7fr] mb-8'>
        <KitchenStats stats={summary.inventory} loading={loading} />

        <div className='bg-card border border-border rounded-lg md:rounded-xl p-4 md:p-6 shadow-sm flex flex-col justify-between gap-4'>
          <div>
            <p className='text-xs md:text-sm text-muted-foreground mb-2'>Recipe Library</p>
            <div className='text-3xl font-semibold'>{loading ? '...' : summary.ownRecipes}</div>
            <p className='text-sm text-muted-foreground mt-2'>Your uploaded recipes are stored in MongoDB and available the next time you open Claudia.</p>
          </div>
          <button
            type='button'
            onClick={() => void loadKitchenData()}
            className='inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors w-fit'
          >
            <RefreshCw className='w-4 h-4' />
            Refresh kitchen data
          </button>
        </div>
      </div>

      {error && (
        <div className='mb-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive'>
          {error}
        </div>
      )}

      <Tabs.Root defaultValue='own-recipes' className='flex flex-col w-full'>
        <Tabs.List className='flex shrink-0 border-b border-border mb-8 overflow-x-auto no-scrollbar'>
          <Tabs.Trigger
            value='own-recipes'
            className='flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all whitespace-nowrap'
          >
            <ChefHat className='w-4 h-4' />
            Own Recipes
          </Tabs.Trigger>
          <Tabs.Trigger
            value='inventory'
            className='flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all whitespace-nowrap'
          >
            <Package className='w-4 h-4' />
            Fridge & Pantry
          </Tabs.Trigger>
          <Tabs.Trigger
            value='saved-recipes'
            className='flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all whitespace-nowrap'
          >
            <Bookmark className='w-4 h-4' />
            Saved Recipes
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value='own-recipes' className='outline-none focus:ring-0'>
          <div className='grid gap-6 xl:grid-cols-[360px,1fr]'>
            <form onSubmit={handleRecipeSubmit} className='rounded-xl border border-border bg-card p-5 sm:p-6 space-y-4 h-fit'>
              <div>
                <h3 className='text-lg font-semibold'>Upload a Recipe</h3>
                <p className='text-sm text-muted-foreground mt-1'>Add your own recipe details and an image so it stays in your personal collection.</p>
              </div>

              <div className='space-y-2'>
                <label htmlFor='recipe-title' className='text-sm font-medium'>Recipe title</label>
                <input id='recipe-title' name='title' required className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/30' placeholder="Grandma's jollof rice" />
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <label htmlFor='recipe-cuisine' className='text-sm font-medium'>Cuisine</label>
                  <input id='recipe-cuisine' name='cuisine' className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/30' placeholder='West African' />
                </div>
                <div className='space-y-2'>
                  <label htmlFor='recipe-prep-time' className='text-sm font-medium'>Prep time</label>
                  <input id='recipe-prep-time' name='prepTime' className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/30' placeholder='45 mins' />
                </div>
              </div>

              <div className='space-y-2'>
                <label htmlFor='recipe-difficulty' className='text-sm font-medium'>Difficulty</label>
                <select id='recipe-difficulty' name='difficulty' defaultValue='Medium' className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/30'>
                  <option value='Easy'>Easy</option>
                  <option value='Medium'>Medium</option>
                  <option value='Hard'>Hard</option>
                </select>
              </div>

              <div className='space-y-2'>
                <label htmlFor='recipe-ingredients' className='text-sm font-medium'>Ingredients</label>
                <textarea id='recipe-ingredients' name='ingredients' rows={5} className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/30' placeholder={'2 cups rice\n1 onion\n3 tomatoes'} />
              </div>

              <div className='space-y-2'>
                <label htmlFor='recipe-directions' className='text-sm font-medium'>Directions</label>
                <textarea id='recipe-directions' name='directions' rows={5} className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/30' placeholder={'Rinse the rice thoroughly.\nSaute the onion until translucent.\nSimmer until cooked through.'} />
              </div>

              <div className='space-y-2'>
                <label htmlFor='recipe-notes' className='text-sm font-medium'>Notes</label>
                <textarea id='recipe-notes' name='notes' rows={3} className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/30' placeholder='Optional serving ideas, substitutions, or family notes.' />
              </div>

              <div className='space-y-2'>
                <label htmlFor='recipe-image' className='text-sm font-medium'>Recipe image</label>
                <input id='recipe-image' name='image' type='file' accept='image/*' className='w-full rounded-lg border border-dashed border-border bg-background px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-2 file:text-accent-foreground' />
              </div>

              {recipeNotice && (
                <p className='text-sm text-muted-foreground'>{recipeNotice}</p>
              )}

              <button type='submit' disabled={recipeSubmitting} className='inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60 w-full'>
                <Plus className='w-4 h-4' />
                {recipeSubmitting ? 'Saving recipe...' : 'Save Recipe'}
              </button>
            </form>

            <div className='space-y-4'>
              <div className='flex items-center justify-between gap-4'>
                <div>
                  <h3 className='text-lg font-semibold'>Your Recipe Collection</h3>
                  <p className='text-sm text-muted-foreground'>These are the recipes you uploaded and can come back to later.</p>
                </div>
                <div className='text-sm text-muted-foreground'>{ownRecipes.length} saved</div>
              </div>

              {loading ? (
                <div className='rounded-xl border border-border border-dashed bg-card/50 p-8 text-center text-muted-foreground'>
                  Loading your recipes...
                </div>
              ) : ownRecipes.length === 0 ? (
                <div className='rounded-xl border border-border border-dashed bg-card/50 p-10 text-center text-muted-foreground'>
                  <ChefHat className='w-12 h-12 mx-auto mb-4 text-muted-foreground/50' />
                  <h3 className='text-lg font-medium text-foreground mb-2'>No recipes saved yet</h3>
                  <p className='max-w-md mx-auto'>Upload your first recipe from the form on the left and it will stay available in your personal library.</p>
                </div>
              ) : (
                <div className='grid gap-5 sm:grid-cols-2 2xl:grid-cols-3'>
                  {ownRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onClick={() => setSelectedRecipe(recipe)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value='inventory' className='outline-none focus:ring-0'>
          <div className='grid gap-6 xl:grid-cols-[360px,1fr]'>
            <form onSubmit={handleInventorySubmit} className='rounded-xl border border-border bg-card p-5 sm:p-6 space-y-4 h-fit'>
              <div>
                <h3 className='text-lg font-semibold'>Track Kitchen Inventory</h3>
                <p className='text-sm text-muted-foreground mt-1'>Log what is in your fridge, pantry, or freezer and attach a photo when it helps.</p>
              </div>

              <div className='space-y-2'>
                <label htmlFor='inventory-name' className='text-sm font-medium'>Item name</label>
                <input id='inventory-name' name='name' required className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/30' placeholder='Bell peppers' />
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <label htmlFor='inventory-category' className='text-sm font-medium'>Category</label>
                  <input id='inventory-category' name='category' className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/30' placeholder='Vegetables' />
                </div>
                <div className='space-y-2'>
                  <label htmlFor='inventory-unit' className='text-sm font-medium'>Unit</label>
                  <input id='inventory-unit' name='unit' className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/30' placeholder='pieces' />
                </div>
              </div>

              <div className='grid gap-4 sm:grid-cols-3'>
                <div className='space-y-2 sm:col-span-1'>
                  <label htmlFor='inventory-quantity' className='text-sm font-medium'>Quantity</label>
                  <input id='inventory-quantity' name='quantity' type='number' min='0' step='0.1' defaultValue='1' className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/30' />
                </div>
                <div className='space-y-2 sm:col-span-1'>
                  <label htmlFor='inventory-location' className='text-sm font-medium'>Location</label>
                  <select id='inventory-location' name='location' defaultValue='Fridge' className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/30'>
                    <option value='Fridge'>Fridge</option>
                    <option value='Pantry'>Pantry</option>
                    <option value='Freezer'>Freezer</option>
                  </select>
                </div>
                <div className='space-y-2 sm:col-span-1'>
                  <label htmlFor='inventory-status' className='text-sm font-medium'>Status</label>
                  <select id='inventory-status' name='status' defaultValue='available' className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/30'>
                    <option value='available'>Available</option>
                    <option value='running-low'>Running low</option>
                    <option value='needed'>Need to buy</option>
                  </select>
                </div>
              </div>

              <div className='space-y-2'>
                <label htmlFor='inventory-expiry' className='text-sm font-medium'>Expiry date</label>
                <input id='inventory-expiry' name='expiresAt' type='date' className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/30' />
              </div>

              <div className='space-y-2'>
                <label htmlFor='inventory-notes' className='text-sm font-medium'>Notes</label>
                <textarea id='inventory-notes' name='notes' rows={3} className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/30' placeholder='Batch cooked, nearly empty, use this week, etc.' />
              </div>

              <div className='space-y-2'>
                <label htmlFor='inventory-image' className='text-sm font-medium'>Item image</label>
                <input id='inventory-image' name='image' type='file' accept='image/*' className='w-full rounded-lg border border-dashed border-border bg-background px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-2 file:text-accent-foreground' />
              </div>

              {inventoryNotice && (
                <p className='text-sm text-muted-foreground'>{inventoryNotice}</p>
              )}

              <button type='submit' disabled={inventorySubmitting} className='inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60 w-full'>
                <Plus className='w-4 h-4' />
                {inventorySubmitting ? 'Saving item...' : 'Add Inventory Item'}
              </button>
            </form>

            <div className='space-y-4'>
              <div className='flex items-center justify-between gap-4'>
                <div>
                  <h3 className='text-lg font-semibold'>What You Have on Hand</h3>
                  <p className='text-sm text-muted-foreground'>Everything you have logged for the fridge, pantry, and freezer.</p>
                </div>
                <div className='text-sm text-muted-foreground'>{inventoryItems.length} items</div>
              </div>

              {loading ? (
                <div className='rounded-xl border border-border border-dashed bg-card/50 p-8 text-center text-muted-foreground'>
                  Loading your inventory...
                </div>
              ) : inventoryItems.length === 0 ? (
                <div className='rounded-xl border border-border border-dashed bg-card/50 p-10 text-center text-muted-foreground'>
                  <Package className='w-12 h-12 mx-auto mb-4 text-muted-foreground/50' />
                  <h3 className='text-lg font-medium text-foreground mb-2'>No inventory items yet</h3>
                  <p className='max-w-md mx-auto'>Add what you have in your fridge or pantry so Claudia can reflect your real kitchen state.</p>
                </div>
              ) : (
                <div className='grid gap-4 md:grid-cols-2'>
                  {inventoryItems.map((item) => (
                    <article key={item.id} className='rounded-xl border border-border bg-card overflow-hidden'>
                      <div className='grid grid-cols-[112px,1fr] min-h-32'>
                        <div className='bg-muted'>
                          <ImageWithFallback src={item.image} alt={item.name} className='h-full w-full object-cover' />
                        </div>
                        <div className='p-4 flex flex-col gap-3'>
                          <div className='flex items-start justify-between gap-3'>
                            <div>
                              <h4 className='font-semibold'>{item.name}</h4>
                              <p className='text-sm text-muted-foreground'>{item.quantity} {item.unit} • {item.location}</p>
                            </div>
                            <span className='rounded-full bg-accent/10 px-2.5 py-1 text-xs text-accent'>
                              {formatStatusLabel(item.status)}
                            </span>
                          </div>

                          <div className='text-sm text-muted-foreground flex flex-wrap gap-3'>
                            <span>{item.category}</span>
                            <span>{formatExpiryDate(item.expiresAt)}</span>
                          </div>

                          {item.notes && (
                            <p className='text-sm text-foreground/80 line-clamp-2'>{item.notes}</p>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value='saved-recipes' className='outline-none focus:ring-0'>
          <div className='p-12 text-center text-muted-foreground border border-border rounded-xl bg-card/50 border-dashed'>
            <Bookmark className='w-12 h-12 mx-auto mb-4 text-muted-foreground/50' />
            <h3 className='text-lg font-medium text-foreground mb-2'>Saved recipes are not wired yet</h3>
            <p className='mb-6 max-w-md mx-auto'>Your personal recipe uploads and kitchen inventory now persist in MongoDB. Saved recipes from the dataset can be added next using the same database layer.</p>
            <a href='/recipes' className='inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium'>
              Browse Dataset Recipes
            </a>
          </div>
        </Tabs.Content>
      </Tabs.Root>

      <RecipeDrawer
        recipe={selectedRecipe}
        isOpen={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />
    </div>
  );
}
