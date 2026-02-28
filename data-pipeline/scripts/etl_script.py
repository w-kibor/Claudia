#!/usr/bin/env python3
"""
ETL Pipeline for Claudia Recipe Platform
Processes Kaggle CSV data into clean JSON and database-ready format

Usage:
    python etl_script.py --input data/raw/recipes.csv --output data/clean/recipes.json
"""

import csv
import json
import sys
import argparse
import re
from pathlib import Path
from typing import Optional, List, Dict, Any
from datetime import datetime


def parse_ingredients(ingredient_str: str) -> Optional[str]:
    """Parse ingredient string - handles various formats"""
    if not ingredient_str:
        return None
    return ingredient_str.strip()


def parse_time(time_str: Optional[str]) -> Optional[int]:
    """Convert time string to minutes (integer)"""
    if not time_str:
        return None

    time_str = str(time_str).strip().lower()

    # Handle "X minutes" or "X mins"
    match = re.search(r"(\d+)\s*(?:minutes?|mins?)", time_str)
    if match:
        return int(match.group(1))

    # Handle "X hours"
    match = re.search(r"(\d+)\s*(?:hours?|hrs?)", time_str)
    if match:
        return int(match.group(1)) * 60

    # Try to parse as direct integer
    try:
        return int(time_str)
    except ValueError:
        return None


def parse_servings(servings_str: Optional[str]) -> Optional[int]:
    """Extract servings as integer"""
    if not servings_str:
        return None

    # Extract first number found
    match = re.search(r"(\d+)", str(servings_str))
    if match:
        return int(match.group(1))

    return None


def parse_difficulty(difficulty_str: Optional[str]) -> str:
    """Normalize difficulty level"""
    if not difficulty_str:
        return "Medium"

    difficulty = difficulty_str.strip().lower()

    if any(word in difficulty for word in ["easy", "simple", "beginner"]):
        return "Easy"
    elif any(word in difficulty for word in ["hard", "difficult", "advanced"]):
        return "Hard"
    else:
        return "Medium"


def parse_csv_row(row: Dict[str, str], row_num: int) -> Optional[Dict[str, Any]]:
    """
    Transform a CSV row into structured recipe format
    Handles multiple CSV column name variations
    """

    # Handle column name variations
    get_field = lambda *keys: next((row.get(k, "") for k in keys if k in row), "")

    try:
        recipe = {
            "id": f"recipe-{row_num}",
            "title": (
                get_field("name", "title", "recipe_name")
                or f"Recipe {row_num}"
            ),
            "description": get_field(
                "description", "summary", "instructions"
            ) or None,
            "imageUrl": get_field("image_url", "imageurl", "image", "url"),
            "prepTime": parse_time(get_field("prep_time", "preptime", "prep"))
            or 0,
            "cookTime": parse_time(get_field("cook_time", "cooktime", "cook"))
            or 0,
            "servings": parse_servings(get_field("servings", "serves")) or 4,
            "difficulty": parse_difficulty(
                get_field("difficulty", "level")
            ),
            "cuisine": get_field("cuisine", "cuisines") or None,
            "dishType": get_field("category", "dish_type", "type", "course") or None,
            "calories": (
                int(get_field("calories", "cal"))
                if get_field("calories", "cal")
                else None
            ),
            "source": get_field("source", "url", "website")
            or "Kaggle Dataset",
            "tags": [
                tag.strip()
                for tag in (
                    get_field("tags", "keywords", "categories").split(",")
                    if get_field("tags", "keywords", "categories")
                    else []
                )
            ],
            "rating": float(get_field("rating", "score"))
            if get_field("rating", "score")
            else None,
            "createdAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat(),
        }

        return recipe

    except Exception as e:
        print(f"Error parsing row {row_num}: {e}", file=sys.stderr)
        return None


def process_csv(input_path: str, output_path: str) -> Dict[str, int]:
    """
    Process CSV file and output structured JSON
    Returns statistics about processing
    """
    input_file = Path(input_path)
    output_file = Path(output_path)

    if not input_file.exists():
        raise FileNotFoundError(f"Input file not found: {input_path}")

    # Create output directory if it doesn't exist
    output_file.parent.mkdir(parents=True, exist_ok=True)

    recipes = []
    stats = {"total": 0, "processed": 0, "errors": 0}

    print(f"📖 Reading recipes from: {input_path}")

    with open(input_file, "r", encoding="utf-8") as f:
        csv_reader = csv.DictReader(f)

        for row_num, row in enumerate(csv_reader, start=1):
            stats["total"] += 1

            recipe = parse_csv_row(row, row_num)
            if recipe:
                recipes.append(recipe)
                stats["processed"] += 1
            else:
                stats["errors"] += 1

            # Progress indicator
            if row_num % 100 == 0:
                print(f"  Processed {row_num} rows...")

    # Write output JSON
    print(f"\n💾 Writing {len(recipes)} recipes to: {output_path}")

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(
            {
                "recipes": recipes,
                "metadata": {
                    "total": len(recipes),
                    "source": "Kaggle Recipes Dataset",
                    "processedAt": datetime.now().isoformat(),
                },
            },
            f,
            indent=2,
        )

    return stats


def main():
    parser = argparse.ArgumentParser(
        description="ETL Pipeline for Claudia Recipe Platform"
    )
    parser.add_argument(
        "--input", "-i", required=True, help="Input CSV file path"
    )
    parser.add_argument(
        "--output", "-o", required=True, help="Output JSON file path"
    )

    args = parser.parse_args()

    try:
        stats = process_csv(args.input, args.output)

        print("\n✅ ETL Pipeline Complete!")
        print(f"   Total rows: {stats['total']}")
        print(f"   Processed: {stats['processed']}")
        print(f"   Errors: {stats['errors']}")

    except Exception as e:
        print(f"❌ Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
