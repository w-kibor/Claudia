# 🍳 Claudia - Recipe Intelligence Platform

> A premium recipe platform inspired by Claude AI's Artifacts. Built with Next.js 15, featuring data-driven recipe management, AI integration, and a beautiful artifact-style interface.

## 🎯 Project Overview

**Claudia** is a recipe intelligence platform that treats recipes like Claude treats code—with intelligence, structure, and elegance. 

- **Artifact View**: Recipes displayed in a side-panel artifact window
- **Code-like Interface**: Ingredients and instructions with syntax highlighting
- **Data Engineering**: ETL pipeline processes Kaggle datasets into clean data
- **AI Integration**: Claude AI for recipe suggestions and variations
- **Modern Stack**: Next.js 15, React, TypeScript, Tailwind CSS, Shadcn/ui

## 📂 Project Structure

```
claudia/
├── data-pipeline/          # Data Engineering Hub
│   ├── raw/               # Drop Kaggle CSV files here
│   ├── clean/             # Processed JSON output
│   └── scripts/           # Python ETL scripts
│
├── frontend/              # Next.js Application
│   ├── src/
│   │   ├── app/          # App Router pages
│   │   ├── components/
│   │   │   ├── ui/       # Base Shadcn components
│   │   │   └── kitchen/  # Claudia-specific components
│   │   ├── lib/
│   │   │   ├── types/    # TypeScript interfaces
│   │   │   ├── db/       # Database utilities
│   │   │   └── utils/    # Helper functions
│   │   └── hooks/        # React custom hooks
│   ├── public/           # Static assets
│   └── package.json
│
└── docs/                 # Documentation
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Styling** | Tailwind CSS, Shadcn/ui (Slate theme) |
| **Icons** | Lucide React |
| **State** | React Hooks, TanStack Query (planned) |
| **Database** | Supabase (PostgreSQL) or MySQL |
| **Data Pipeline** | Python (pandas, CSV processing) |
| **AI** | Claude API (Anthropic) |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Python 3.8+ (for ETL pipeline)

### Setup Frontend

```bash
cd frontend
npm install

# Create environment file
cp .env.example .env.local
# Update .env.local with your configuration
```

### Running the Development Server

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Setup Data Pipeline

```bash
cd data-pipeline

# 1. Place your Kaggle recipes CSV in raw/
cp your_recipes.csv raw/recipes.csv

# 2. Create Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Run ETL script
python scripts/etl_script.py --input raw/recipes.csv --output clean/recipes.json
```

## 📦 Core Components

### RecipeCard Component

Premium artifact-style component for displaying recipes:

```tsx
import { RecipeCard } from "@/components/kitchen/RecipeCard";

<RecipeCard
  title="Pad Thai"
  ingredients={[...]}
  instructions={[...]}
  prepTime={15}
  cookTime={15}
  servings={4}
  difficulty="Medium"
  isArtifact={true}
/>
```

**Features**:
- 🖼️ High-quality image with hover effects
- 📊 Quick stat displays (time, servings, difficulty)
- 🧪 Syntax-highlighted ingredients list
- 📝 Step-by-step instructions with timing
- 💡 Chef's tips section
- 🏷️ Cuisine and dish type tags

### Database

Supports multiple database backends:

```typescript
// SQLite (default, local development)
DATABASE_TYPE=sqlite

// MySQL
DATABASE_TYPE=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306

// PostgreSQL (Supabase)
DATABASE_TYPE=postgres
DATABASE_HOST=your-db.supabase.co
```

### ETL Pipeline

Python script that:
- ✅ Reads Kaggle CSV files
- ✅ Parses and normalizes data
- ✅ Handles multiple column name variations
- ✅ Outputs structured JSON
- ✅ Produces processing statistics

```bash
python scripts/etl_script.py \
  --input raw/recipes.csv \
  --output clean/recipes.json
```

## 🎨 Design System

**Color Palette** (Slate theme):
- Primary: Emerald (Artifacts, success states)
- Secondary: Blue (Instructions, info)
- Accent: Amber (Time, warnings)
- Destructive: Red (Errors)

**Typography**:
- Display: Geist (sans-serif)
- Monospace: Geist Mono (code, ingredients)

## 📝 Roadmap

- [x] Project structure and setup
- [x] RecipeCard component
- [x] Basic ETL pipeline
- [ ] Database schema and migrations
- [ ] Recipe search and filtering
- [ ] API endpoints
- [ ] Claude AI integration
- [ ] Recipe variation generation
- [ ] User authentication
- [ ] Recipe ratings and reviews
- [ ] PWA capabilities

## 🤝 Using Data from Kaggle

1. Download a recipes dataset from [Kaggle Recipes](https://www.kaggle.com/search?q=recipes)
2. Place the CSV in `data-pipeline/raw/`
3. Run the ETL script
4. Processed data appears in `data-pipeline/clean/recipes.json`

**Supported Column Names** (automatically detected):
- Recipe: `name`, `title`, `recipe_name`
- Time: `prep_time`, `preptime`, `cook_time`, `cooktime`
- Image: `image_url`, `imageurl`, `image`
- Ingredients: `ingredients`
- Instructions: `instructions`, `steps`
- Tags: `tags`, `keywords`, `categories`

## 💡 Development Tips

### Add New Shadcn Component

```bash
cd frontend
npx shadcn-ui@latest add [component-name]
```

### Create New Recipe Feature

1. Add types to `src/lib/types/recipe.ts`
2. Create component in `src/components/kitchen/`
3. Add hook in `src/hooks/` if needed
4. Use in pages under `src/app/`

### Environment Variables

Copy `.env.example` to `.env.local`:
```bash
cd frontend
cp .env.example .env.local
```

Update with your values:
- `DATABASE_*`: Your database configuration
- `ANTHROPIC_API_KEY`: Claude API key
- `NEXT_PUBLIC_*`: Client-side variables

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Claude API](https://console.anthropic.com)
- [Kaggle Datasets](https://www.kaggle.com/datasets)

## 📄 License

MIT License - feel free to use this for learning and projects!

## 👨‍💻 About

Built by a 4th-year IT Student with experience in:
- 🔄 Data Engineering (ETL pipelines)
- 🤖 AI Agents (Langflow)
- 📱 Progressive Web Apps (PWA)

---

**Ready to cook? Let's build Claudia! 🍳**
