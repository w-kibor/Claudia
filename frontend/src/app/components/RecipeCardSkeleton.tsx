import { Clock, TrendingUp } from 'lucide-react';

export function RecipeCardSkeleton() {
    return (
        <div className="relative overflow-hidden rounded-lg bg-muted shadow-sm ring-1 ring-border/10 cursor-default">
            {/* Image Skeleton */}
            <div className="aspect-[4/5] w-full animate-pulse bg-muted-foreground/10" />

            {/* Info Overlay Skeleton - Mimicking the bottom bar */}
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 backdrop-blur-md bg-black/5 border-t border-border/10">
                <div className="flex items-center justify-between gap-2">
                    {/* Prep time skeleton */}
                    <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 text-muted-foreground/30" />
                        <div className="h-3 w-12 rounded-sm bg-muted-foreground/20 animate-pulse" />
                    </div>

                    {/* Difficulty badge skeleton */}
                    <div className="h-4 w-14 rounded-full bg-muted-foreground/20 animate-pulse" />
                </div>
            </div>

            {/* Recipe Name Skeleton */}
            <div className="absolute inset-x-0 bottom-16 p-3 md:p-4">
                {/* Title (2 lines max approximation) */}
                <div className="space-y-2">
                    <div className="h-5 w-3/4 bg-muted-foreground/20 rounded animate-pulse" />
                    <div className="h-5 w-1/2 bg-muted-foreground/20 rounded animate-pulse" />
                </div>
                {/* Cuisine subtitle */}
                <div className="h-3 w-1/4 bg-muted-foreground/20 rounded animate-pulse mt-3" />
            </div>

            {/* Quick Add Button Skeleton */}
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-muted flex items-center justify-center shadow-sm">
                <TrendingUp className="w-4 h-4 text-muted-foreground/30 animate-pulse" />
            </div>
        </div>
    );
}
