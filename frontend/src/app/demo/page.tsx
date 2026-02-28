"use client";

import React from "react";
import { RecipeCard } from "@/components/kitchen/RecipeCard";
import { Recipe } from "@/lib/types/recipe";

/**
 * Demo page showcasing the RecipeCard component
 * Replace with real data from API when ready
 */

const DEMO_RECIPE: Recipe = {
  id: "demo-1",
  title: "Classic Pad Thai with Shrimp",
  description:
    "A vibrant and authentic Thai dish with tender shrimp, rice noodles, and a perfect balance of sweet, sour, and spicy flavors.",
  imageUrl:
    "https://images.unsplash.com/photo-1557872552-2b3d10e65d73?w=800&q=80",
  prepTime: 15,
  cookTime: 15,
  servings: 4,
  difficulty: "Medium",
  cuisine: "Thai",
  dishType: "Main Course",
  ingredients: [
    {
      id: "ing-1",
      name: "Rice Noodles",
      quantity: "8",
      unit: "oz",
      optional: false,
    },
    {
      id: "ing-2",
      name: "Large Shrimp",
      quantity: "1",
      unit: "lb",
      optional: false,
    },
    {
      id: "ing-3",
      name: "Tamarind Paste",
      quantity: "3",
      unit: "tbsp",
      optional: false,
    },
    {
      id: "ing-4",
      name: "Fish Sauce",
      quantity: "2",
      unit: "tbsp",
      optional: false,
    },
    {
      id: "ing-5",
      name: "Lime Juice",
      quantity: "2",
      unit: "tbsp",
      optional: false,
    },
    {
      id: "ing-6",
      name: "Palm Sugar",
      quantity: "2",
      unit: "tbsp",
      optional: false,
      asianAlternative: "Brown sugar",
    },
    {
      id: "ing-7",
      name: "Garlic Cloves",
      quantity: "3",
      unit: "cloves",
      optional: false,
    },
    {
      id: "ing-8",
      name: "Red Chili Peppers",
      quantity: "2",
      unit: "whole",
      optional: true,
    },
    {
      id: "ing-9",
      name: "Peanuts (Roasted)",
      quantity: "0.5",
      unit: "cup",
      optional: true,
    },
    {
      id: "ing-10",
      name: "Green Onions",
      quantity: "3",
      unit: "stalks",
      optional: false,
    },
  ],
  instructions: [
    {
      id: "instr-1",
      step: 1,
      description:
        "Soak rice noodles in hot water for 8-10 minutes until they are soft and pliable. Drain and set aside.",
      timeRequired: 10,
      equipmentNeeded: ["Bowl", "Colander"],
    },
    {
      id: "instr-2",
      step: 2,
      description:
        "In a small bowl, combine tamarind paste, fish sauce, lime juice, and palm sugar. Mix well until sugar dissolves.",
      timeRequired: 3,
      equipmentNeeded: ["Bowl", "Spoon"],
    },
    {
      id: "instr-3",
      step: 3,
      description:
        "Heat oil in a large wok or skillet over high heat. When hot, add minced garlic and cook for 30 seconds until fragrant.",
      timeRequired: 1,
      equipmentNeeded: ["Wok", "Oil"],
    },
    {
      id: "instr-4",
      step: 4,
      description:
        "Add shrimp to the wok and stir-fry for 2-3 minutes until they start to turn pink.",
      timeRequired: 3,
      equipmentNeeded: ["Wok"],
    },
    {
      id: "instr-5",
      step: 5,
      description:
        "Add drained noodles and half of the sauce. Toss everything together for 2 minutes.",
      timeRequired: 2,
      equipmentNeeded: ["Wok"],
    },
    {
      id: "instr-6",
      step: 6,
      description:
        "Pour remaining sauce over the noodles and mix thoroughly. Cook for another minute.",
      timeRequired: 1,
      equipmentNeeded: ["Wok"],
    },
    {
      id: "instr-7",
      step: 7,
      description:
        "Transfer to serving plates and garnish with crushed peanuts, red chili, and green onions.",
      timeRequired: 2,
      equipmentNeeded: ["Plate"],
    },
  ],
  tips: [
    "Don't overcook the shrimp or they'll become tough and rubbery",
    "Tamarind paste is key to authentic flavor - don't substitute with vinegar alone",
    "Prepare all ingredients before starting to cook due to fast cooking time",
    "For extra flavor, add a tablespoon of oyster sauce",
  ],
  calories: 320,
  rating: 4.8,
  reviewCount: 245,
  source: "Kaggle Recipes Dataset",
  tags: ["Asian", "Quick", "Seafood", "Gluten-Free"],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function RecipeShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            🍳 Claudia Recipe Intelligence
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Explore recipes with Claude-inspired artifact design. Below is a demo
            of the premium RecipeCard component treating recipes like intelligent
            code.
          </p>
        </div>

        {/* Recipe Card Demo */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            Featured Recipe
          </h2>
          <RecipeCard {...DEMO_RECIPE} isArtifact={true} />
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-semibold text-slate-900 dark:text-slate-50">
              ✨ Artifact View
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Recipes displayed in a side-panel artifact window inspired by
              Claude's UI design system.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-semibold text-slate-900 dark:text-slate-50">
              💻 Code-like Interface
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Ingredients and instructions presented with syntax highlighting and
              structure similar to code blocks.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-semibold text-slate-900 dark:text-slate-50">
              🍳 Culinary Logic
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Data-driven approach with ingredients, instructions, and tips
              organized hierarchically.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-semibold text-slate-900 dark:text-slate-50">
              📊 Data Engineering
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              ETL pipeline processes Kaggle CSV datasets into structured JSON and
              databases.
            </p>
          </div>
        </div>

        {/* Developer Info */}
        <div className="rounded-lg border-l-4 border-emerald-500 bg-emerald-50 p-6 dark:border-emerald-600 dark:bg-emerald-950">
          <h3 className="font-semibold text-emerald-900 dark:text-emerald-200">
            Next Steps
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-emerald-800 dark:text-emerald-300">
            <li>✓ Set up Next.js 15 with App Router</li>
            <li>✓ Create RecipeCard component with Shadcn/ui</li>
            <li>→ Add TanStack Query for data fetching</li>
            <li>→ Set up Supabase/MySQL database</li>
            <li>→ Build ETL pipeline for Kaggle data</li>
            <li>→ Create recipe search and filter UI</li>
            <li>→ Integrate Claude API for recipe suggestions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
