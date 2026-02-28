"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Clock,
  Users,
  Flame,
  ChefHat,
  Lightbulb,
  AlertCircle,
} from "lucide-react";

export interface RecipeCardProps {
  id: string;
  title: string;
  description?: string;
  prepTime?: number; // in minutes
  cookTime?: number; // in minutes
  servings?: number;
  difficulty?: "Easy" | "Medium" | "Hard";
  cuisine?: string;
  dishType?: string;
  imageUrl?: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  tips?: string[];
  calories?: number;
  isArtifact?: boolean; // Controls the highlighted "Artifact" appearance
}

interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  optional?: boolean;
}

interface Instruction {
  id: string;
  step: number;
  description: string;
  timeRequired?: number;
}

/**
 * Premium RecipeCard Component
 * Displays recipes like Claude Artifacts with code-like aesthetics
 * Treats ingredients/instructions as structured data
 */
export const RecipeCard: React.FC<RecipeCardProps> = ({
  id,
  title,
  description,
  prepTime = 0,
  cookTime = 0,
  servings = 4,
  difficulty = "Medium",
  cuisine,
  dishType,
  imageUrl,
  ingredients,
  instructions,
  tips,
  calories,
  isArtifact = true,
}) => {
  const totalTime = prepTime + cookTime;
  const caloriesPerServing = calories ? Math.round(calories / servings) : null;

  const difficultyColor = {
    Easy: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950",
    Medium: "bg-amber-100 text-amber-900 dark:bg-amber-950",
    Hard: "bg-red-100 text-red-900 dark:bg-red-950",
  };

  return (
    <div className={cn("w-full", isArtifact && "relative")}>
      {/* Artifact Indicator Badge */}
      {isArtifact && (
        <div className="mb-2 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Recipe Artifact
          </span>
        </div>
      )}

      <Card className={cn("overflow-hidden transition-all", isArtifact && "border-2 border-emerald-200 shadow-lg dark:border-emerald-900")}>
        {/* Hero Image Section */}
        {imageUrl && (
          <div className="relative h-64 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
            {/* Overlay Badge */}
            <div className="absolute top-4 right-4 flex gap-2">
              {difficulty && (
                <Badge
                  className={cn("font-semibold", difficultyColor[difficulty])}
                >
                  {difficulty}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Header Section */}
        <CardHeader className="border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-3">
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight">
                {title}
              </CardTitle>
              {description && (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {description}
                </p>
              )}
            </div>

            {/* Metadata Tags */}
            <div className="flex flex-wrap gap-2">
              {cuisine && <Badge variant="secondary">{cuisine}</Badge>}
              {dishType && <Badge variant="secondary">{dishType}</Badge>}
            </div>
          </div>
        </CardHeader>

        {/* Quick Stats Section */}
        <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {/* Prep Time */}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Prep
                </p>
                <p className="font-semibold text-slate-900 dark:text-slate-50">
                  {prepTime}m
                </p>
              </div>
            </div>

            {/* Cook Time */}
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cook
                </p>
                <p className="font-semibold text-slate-900 dark:text-slate-50">
                  {cookTime}m
                </p>
              </div>
            </div>

            {/* Servings */}
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Serves
                </p>
                <p className="font-semibold text-slate-900 dark:text-slate-50">
                  {servings}
                </p>
              </div>
            </div>

            {/* Calories */}
            {caloriesPerServing && (
              <div className="flex items-center gap-2">
                <ChefHat className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Cal/srv
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-slate-50">
                    {caloriesPerServing}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Sections */}
        <CardContent className="space-y-8 py-6">
          {/* Ingredients Section - "Syntax" Style */}
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
              <span className="font-mono text-emerald-600 dark:text-emerald-400">
                {"{"}
              </span>
              Ingredients
              <span className="font-mono text-emerald-600 dark:text-emerald-400">
                {"}"}
              </span>
            </h3>

            <div className="space-y-2 rounded-lg bg-slate-50 p-4 font-mono text-sm dark:bg-slate-900">
              {ingredients.map((ingredient) => (
                <div
                  key={ingredient.id}
                  className={cn(
                    "flex items-center justify-between py-2 transition-colors",
                    ingredient.optional &&
                      "text-slate-400 dark:text-slate-600"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {/* Bullet indicator */}
                    <span className="text-emerald-500">•</span>

                    {/* Ingredient name with syntax highlighting */}
                    <div>
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {ingredient.quantity}
                      </span>
                      <span className="mx-2 text-slate-400 dark:text-slate-600">
                        {ingredient.unit}
                      </span>
                      <span className="text-slate-900 dark:text-slate-50">
                        {ingredient.name}
                      </span>
                    </div>
                  </div>

                  {/* Optional tag */}
                  {ingredient.optional && (
                    <Badge variant="outline" className="text-xs">
                      optional
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {ingredients.length} items
            </p>
          </div>

          {/* Instructions Section - "Steps" Style */}
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
              <span className="font-mono text-blue-600 dark:text-blue-400">
                {"{"}
              </span>
              Instructions
              <span className="font-mono text-blue-600 dark:text-blue-400">
                {"}"}
              </span>
            </h3>

            <div className="space-y-4">
              {instructions.map((instruction, index) => (
                <div
                  key={instruction.id}
                  className="flex gap-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800"
                >
                  {/* Step Number - Like Code Line Numbers */}
                  <div className="flex min-w-fit items-start">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 font-mono text-sm font-semibold text-blue-900 dark:bg-blue-950 dark:text-blue-300">
                      {String(instruction.step).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Instruction Content */}
                  <div className="flex-1 space-y-2">
                    <p className="text-slate-900 dark:text-slate-50">
                      {instruction.description}
                    </p>
                    {instruction.timeRequired && (
                      <Badge variant="time" className="text-xs">
                        <Clock className="mr-1 h-3 w-3" />
                        {instruction.timeRequired}m
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips Section - "Error Handling" Style */}
          {tips && tips.length > 0 && (
            <div className="space-y-3 rounded-lg border-l-4 border-amber-400 bg-amber-50 p-4 dark:border-amber-600 dark:bg-amber-950">
              <h3 className="flex items-center gap-2 font-semibold text-amber-900 dark:text-amber-200">
                <Lightbulb className="h-5 w-5" />
                Chef's Tips
              </h3>
              <ul className="space-y-2">
                {tips.map((tip, index) => (
                  <li
                    key={index}
                    className="flex gap-2 text-sm text-amber-800 dark:text-amber-300"
                  >
                    <span className="mt-0.5">→</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>

        {/* Footer with Action Hint */}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-3 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            💡 Try adjusting ingredients or asking Claude for variations of this
            recipe.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default RecipeCard;
