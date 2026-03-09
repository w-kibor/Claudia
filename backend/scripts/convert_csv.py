import pandas as pd
import json
import os
import math

source_file = os.path.join(os.path.dirname(__file__), '../../data-pipeline/raw/Recipes_with_Images.csv')
target_file = os.path.join(os.path.dirname(__file__), '../data/recipes_small.json')

print(f"Reading from {source_file}")
df = pd.read_csv(source_file, index_col=False)

recipes = []
for index, row in df.iterrows():
    # Handle NaN values safely
    def get_val(val, default=''):
        return default if pd.isna(val) else val
        
    def split_lines(txt):
        if pd.isna(txt): return []
        return [line.strip() for line in str(txt).split('\n') if line.strip()]

    recipe = {
        "id": str(get_val(row.get('index'), index)),
        "title": get_val(row.get('title'), 'Unknown Recipe').strip(),
        "about": get_val(row.get('about')),
        "ingredients": split_lines(row.get('ingridients')),
        "directions": split_lines(row.get('preparation')),
        "imageUrl": None,
        "prepTime": 30,
        "cuisine": "African",
        "difficulty": "Medium",
        "nutrition": {
            "energy_kcal": get_val(row.get('energy(kcal)'), 0),
            "fat_g": get_val(row.get('fat(g)'), 0),
            "carbohydrates_g": get_val(row.get('carbohydrates(g)'), 0),
            "proteins_g": get_val(row.get('proteins(g)'), 0),
            "fibre_g": get_val(row.get('fibre(g)'), 0)
        }
    }
    
    # Process image path
    image_path = get_val(row.get('image_path'))
    if image_path:
        # Expected format: "images/..."
        recipe['imageUrl'] = f"/{image_path}"
        
    recipes.append(recipe)

output = {
    "recipes": recipes
}

os.makedirs(os.path.dirname(target_file), exist_ok=True)
with open(target_file, 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2)

print(f"Successfully wrote {len(recipes)} recipes to {target_file}")
