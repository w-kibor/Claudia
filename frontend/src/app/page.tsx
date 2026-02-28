import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍳</span>
            <h1 className="text-xl font-bold text-white">Claudia</h1>
          </div>
          <div className="text-sm text-slate-400">
            Recipe Intelligence Platform
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-24 space-y-12">
        <div className="space-y-6 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
            Claudia: Recipe Intelligence
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            A premium recipe platform inspired by Claude AI's Artifacts. Explore
            recipes with intelligent design, data-driven insights, and culinary
            expertise.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/demo"
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
          >
            View Demo Recipe →
          </Link>
          <a
            href="#features"
            className="px-8 py-3 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white font-semibold rounded-lg transition-colors"
          >
            Learn More
          </a>
        </div>

        {/* Features Grid */}
        <div
          id="features"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-12"
        >
          <FeatureCard
            icon="✨"
            title="Artifact Interface"
            description="Side-panel recipe display inspired by Claude's UI design language"
          />
          <FeatureCard
            icon="💻"
            title="Code-Like Design"
            description="Ingredients and instructions presented with syntax highlighting and structure"
          />
          <FeatureCard
            icon="📊"
            title="Data Engineering"
            description="ETL pipeline processes Kaggle datasets into clean, structured data"
          />
          <FeatureCard
            icon="🔍"
            title="Advanced Search"
            description="Filter by cuisine, difficulty, time, and dietary preferences"
          />
          <FeatureCard
            icon="🤖"
            title="Claude Integration"
            description="AI-powered recipe suggestions and recipe variations"
          />
          <FeatureCard
            icon="⚡"
            title="Modern Stack"
            description="Next.js 15, React Hooks, TanStack Query, and Tailwind CSS"
          />
        </div>

        {/* Tech Stack */}
        <div className="pt-12 border-t border-slate-800">
          <h3 className="text-2xl font-bold text-white mb-8">Tech Stack</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TechBadge name="Next.js 15" />
            <TechBadge name="React 19" />
            <TechBadge name="TypeScript" />
            <TechBadge name="Tailwind CSS" />
            <TechBadge name="Shadcn/ui" />
            <TechBadge name="TanStack Query" />
            <TechBadge name="Supabase/MySQL" />
            <TechBadge name="Claude API" />
          </div>
        </div>

        {/* Project Structure */}
        <div className="pt-12 border-t border-slate-800">
          <h3 className="text-2xl font-bold text-white mb-6">Project Structure</h3>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-6 font-mono text-sm text-slate-300 overflow-x-auto">
            <pre>{`claudia/
├── data-pipeline/          # ETL & Data Engineering
│   ├── raw/               # Raw Kaggle CSVs
│   ├── clean/             # Processed JSON
│   └── scripts/           # ETL scripts (Python)
├── frontend/              # Next.js Application
│   ├── src/
│   │   ├── app/          # App Router pages
│   │   ├── components/
│   │   │   ├── ui/       # Shadcn components
│   │   │   └── kitchen/  # Recipe components
│   │   ├── lib/
│   │   │   ├── types/    # TypeScript interfaces
│   │   │   ├── db/       # Database utils
│   │   │   └── utils/    # Helpers
│   │   └── hooks/        # React hooks
│   └── public/           # Static assets
└── docs/                 # Documentation`}</pre>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-24 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-slate-400">
          <p>
            Built with ❤️ by a 4th-year IT Student | Data Engineering ×
            Claude AI × PWA
          </p>
        </div>
      </footer>
    </main>
  );
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg p-6 space-y-3 transition-colors">
      <div className="text-3xl">{icon}</div>
      <h4 className="font-semibold text-white">{title}</h4>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}

interface TechBadgeProps {
  name: string;
}

function TechBadge({ name }: TechBadgeProps) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded px-4 py-2 text-center text-sm text-slate-300">
      {name}
    </div>
  );
}
