/**
 * Quick Start Guide for Claudia Development
 */

# 🚀 Claudia - Quick Start

## Initial Setup

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Edit .env.local with your settings

# 4. Start development server
npm run dev
```

Visit: http://localhost:3000

## Folder Setup Guide

### For Frontend Development

```bash
cd frontend

# Create a new page
mkdir -p src/app/recipes
touch src/app/recipes/page.tsx

# Create a new component
mkdir -p src/components/kitchen/RecipeList
touch src/components/kitchen/RecipeList/index.tsx
```

### For Data Engineering

```bash
cd data-pipeline

# Place Kaggle CSV in raw/
cp ~/Downloads/recipes.csv raw/

# Process with ETL
python scripts/etl_script.py --input raw/recipes.csv --output clean/recipes.json
```

## Component Usage Examples

### Using RecipeCard

```tsx
import { RecipeCard } from "@/components/kitchen";
import type { Recipe } from "@/lib/types";

const recipe: Recipe = {
  id: "1",
  title: "Pasta Carbonara",
  ingredients: [...],
  instructions: [...],
  // ... other fields
};

export default function Page() {
  return <RecipeCard {...recipe} isArtifact={true} />;
}
```

### Using Hooks

```tsx
import { useFetchRecipes } from "@/hooks";

export default function RecipeList() {
  const { recipes, loading, error } = useFetchRecipes();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {recipes.map(recipe => (
        <RecipeCard key={recipe.id} {...recipe} />
      ))}
    </div>
  );
}
```

## File Structure Best Practices

### Pages (src/app)
```
src/app/
├── page.tsx              # Home page
├── layout.tsx            # Root layout
├── demo/
│   └── page.tsx          # Demo page
├── recipes/
│   ├── page.tsx          # Recipes list
│   └── [id]/
│       └── page.tsx      # Single recipe detail
```

### Components (src/components)
```
src/components/
├── ui/                   # Base components (from shadcn)
│   ├── card.tsx
│   ├── badge.tsx
│   └── index.ts
├── kitchen/              # Claudia-specific
│   ├── RecipeCard.tsx
│   ├── RecipeSearch.tsx
│   └── index.ts
```

### Types (src/lib/types)
```
src/lib/types/
├── recipe.ts             # Main recipe types
├── kaggle.ts             # Data pipeline types
└── index.ts              # Export all
```

## Common Tasks

### Add a New Shadcn Component

```bash
cd frontend
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add dropdown-menu
```

### Create a New API Route

```bash
mkdir -p src/app/api/recipes
echo 'export async function GET(req) { return Response.json({}); }' > src/app/api/recipes/route.ts
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
# Follow the prompts
```

## Environment Variables Needed

```
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
DATABASE_TYPE=sqlite
DATABASE_FILEPATH=./data/claudia.db
ANTHROPIC_API_KEY=your_key_here
```

## Useful npm Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run type-check  # TypeScript check
```

## Debugging Tips

- Use `console.log()` with component names: `console.log('[RecipeCard]', data)`
- Check React DevTools browser extension
- Use Next.js Debug mode: `DEBUG=* npm run dev`
- Look at Network tab in browser DevTools for API calls

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Shadcn/ui Docs](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Claude API](https://console.anthropic.com)

---

**Happy coding! 🍳✨**
