import * as Tabs from '@radix-ui/react-tabs';
import { ChefHat, Bookmark, Calendar } from 'lucide-react';
import { KitchenStats } from '../components/KitchenStats';

export default function MyKitchen() {
  return (
    <div className='p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold tracking-tight mb-2'>My Kitchen</h1>
        <p className='text-muted-foreground text-lg'>Manage your personal recipes, saved favorites, and meal plans.</p>
      </div>

      <div className='mb-8'>
        <KitchenStats />
      </div>

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
            value='saved-recipes'
            className='flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all whitespace-nowrap'
          >
            <Bookmark className='w-4 h-4' />
            Saved Recipes
          </Tabs.Trigger>
          <Tabs.Trigger
            value='meal-plans'
            className='flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all whitespace-nowrap'
          >
            <Calendar className='w-4 h-4' />
            Weekly Meal Plans
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value='own-recipes' className='outline-none focus:ring-0'>
          <div className='p-12 text-center text-muted-foreground border border-border rounded-xl bg-card/50 border-dashed'>
            <ChefHat className='w-12 h-12 mx-auto mb-4 text-muted-foreground/50' />
            <h3 className='text-lg font-medium text-foreground mb-2'>No Recipes Yet</h3>
            <p className='mb-6 max-w-sm mx-auto'>You haven't created any of your own recipes yet. Start cooking and save your own variations!</p>
            <button className='px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium'>
              Create New Recipe
            </button>
          </div>
        </Tabs.Content>

        <Tabs.Content value='saved-recipes' className='outline-none focus:ring-0'>
          <div className='p-12 text-center text-muted-foreground border border-border rounded-xl bg-card/50 border-dashed'>
            <Bookmark className='w-12 h-12 mx-auto mb-4 text-muted-foreground/50' />
            <h3 className='text-lg font-medium text-foreground mb-2'>No Saved Recipes</h3>
            <p className='mb-6 max-w-sm mx-auto'>Browse the generic collection and save some recipes to easily find them later here.</p>
            <a href="/recipes" className='inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium'>
              Browse Collection
            </a>
          </div>
        </Tabs.Content>

        <Tabs.Content value='meal-plans' className='outline-none focus:ring-0'>
          <div className='p-12 text-center text-muted-foreground border border-border rounded-xl bg-card/50 border-dashed'>
            <Calendar className='w-12 h-12 mx-auto mb-4 text-muted-foreground/50' />
            <h3 className='text-lg font-medium text-foreground mb-2'>No Meal Plans</h3>
            <p className='mb-6 max-w-sm mx-auto'>Plan your meals ahead to save time and ensure you have all the necessary ingredients.</p>
            <button className='px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium'>
              Create Meal Plan
            </button>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
