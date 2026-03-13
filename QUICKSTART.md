/**
 * Quick Start Guide for Claudia Development
 */

# Claudia - Quick Start

## Initial Setup

```bash
# 1. Start the full stack, including MongoDB
docker compose up --build
```

This starts:
- frontend on http://localhost:3000
- backend on http://localhost:3001
- MongoDB on mongodb://localhost:27017/claudia

## Manual Setup

```bash
# 1. Start MongoDB locally or with Docker
docker run --name claudia-mongo -p 27017:27017 -d mongo:7

# 2. Install backend dependencies
cd backend
npm install
export MONGODB_URI=mongodb://127.0.0.1:27017/claudia
export DEFAULT_PROFILE_ID=demo-user
npm run dev

# 3. In a second terminal, install frontend dependencies
cd frontend

npm install
export VITE_API_BASE_URL=http://localhost:3001
npm run dev
```

Visit: http://localhost:3000

## Folder Setup Guide

### For Frontend Development

```bash
cd frontend

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

### Deploy to Vercel

```bash
npm install -g vercel
vercel
# Follow the prompts
```

## Environment Variables Needed

```
# Frontend
VITE_API_BASE_URL=http://localhost:3001

# Backend
MONGODB_URI=mongodb://127.0.0.1:27017/claudia
DEFAULT_PROFILE_ID=demo-user
GEMINI_API_KEY=your_key_here
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
- Look at Network tab in browser DevTools for API calls

## Resources

- [Vite Docs](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [Shadcn/ui Docs](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Claude API](https://console.anthropic.com)

---

**Happy coding! 🍳✨**
