import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface RecipeFiltersProps {
    onSearch: (query: string) => void;
    onFilterCuisine: (cuisine: string | null) => void;
    onFilterDifficulty: (difficulty: string | null) => void;
    cuisines: string[];
    difficulties: string[];
}

export function RecipeFilters({
    onSearch,
    onFilterCuisine,
    onFilterDifficulty,
    cuisines,
    difficulties
}: RecipeFiltersProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCuisine, setActiveCuisine] = useState<string | null>(null);
    const [activeDifficulty, setActiveDifficulty] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, onSearch]);

    const handleCuisineClick = (cuisine: string) => {
        const newCuisine = activeCuisine === cuisine ? null : cuisine;
        setActiveCuisine(newCuisine);
        onFilterCuisine(newCuisine);
    };

    const handleDifficultyClick = (diff: string) => {
        const newDiff = activeDifficulty === diff ? null : diff;
        setActiveDifficulty(newDiff);
        onFilterDifficulty(newDiff);
    };

    const clearAllFilters = () => {
        setSearchQuery('');
        setActiveCuisine(null);
        setActiveDifficulty(null);
        onSearch('');
        onFilterCuisine(null);
        onFilterDifficulty(null);
    };

    return (
        <div className="w-full space-y-4 mb-6">
            {/* Search Bar Row */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search recipes, ingredients, cuisines..."
                        className="w-full h-11 pl-10 pr-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-3 flex items-center"
                        >
                            <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                        </button>
                    )}
                </div>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`h-11 px-4 flex items-center gap-2 rounded-xl border transition-colors ${showFilters || activeCuisine || activeDifficulty
                            ? 'bg-accent/10 border-accent/20 text-accent'
                            : 'bg-background border-border text-foreground hover:bg-muted'
                        }`}
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="text-sm font-medium hidden sm:inline">Filters</span>
                    {(activeCuisine || activeDifficulty) && (
                        <span className="w-2 h-2 rounded-full bg-accent" />
                    )}
                </button>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
                <div className="p-4 bg-card border border-border rounded-xl space-y-4 animate-in slide-in-from-top-2 opacity-100">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold">Filter Recipes</h3>
                        {(activeCuisine || activeDifficulty || searchQuery) && (
                            <button
                                onClick={clearAllFilters}
                                className="text-xs text-muted-foreground hover:text-accent transition-colors"
                            >
                                Clear all
                            </button>
                        )}
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-muted-foreground mb-2 block uppercase tracking-wider font-semibold">
                                By Difficulty
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {difficulties.map(diff => (
                                    <button
                                        key={diff}
                                        onClick={() => handleDifficultyClick(diff)}
                                        className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${activeDifficulty === diff
                                                ? 'bg-accent border-accent text-accent-foreground shadow-sm'
                                                : 'bg-background border-border hover:border-accent/50'
                                            }`}
                                    >
                                        {diff}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-muted-foreground mb-2 block uppercase tracking-wider font-semibold">
                                By Cuisine
                            </label>
                            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2 pb-2 custom-scrollbar">
                                {cuisines.map(cuisine => (
                                    <button
                                        key={cuisine}
                                        onClick={() => handleCuisineClick(cuisine)}
                                        className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${activeCuisine === cuisine
                                                ? 'bg-accent border-accent text-accent-foreground shadow-sm'
                                                : 'bg-background border-border hover:border-accent/50'
                                            }`}
                                    >
                                        {cuisine}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
