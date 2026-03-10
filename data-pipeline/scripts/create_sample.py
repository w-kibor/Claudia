#!/usr/bin/env python3
"""
Create a sample dataset from the first 1,000 recipes for development
"""

import pandas as pd
import json
from pathlib import Path

def create_sample_dataset():
    """Extract first 1,000 recipes and save as JSON"""
    
    # Read the CSV
    print("📖 Reading recipe dataset...")
    df = pd.read_csv('raw/recipes_data.csv', nrows=1000)
    
    print(f"✅ Loaded {len(df)} recipes")
    
    # Convert to list of dictionaries
    recipes = []
    
    # Define difficulty and cuisine options
    difficulties = ['Easy', 'Medium', 'Hard']
    cuisines = ['American', 'Italian', 'Mexican', 'Asian', 'French', 'Mediterranean', 'Indian', 'International']
    
    def get_placeholder_image(index):
        """Generate a placeholder image URL"""
        # Use placeholder.com which is reliable
        colors = ['ff6b6b', 'f06292', '9c27b0', '673ab7', '3f51b5', '2196f3', 
                  '00bcd4', '009688', '4caf50', 'cddc39', 'ffeb3b', 'ff9800', 
                  'ff5722', '795548', 'e91e63', '607d8b']
        color = colors[index % len(colors)]
        return f'https://via.placeholder.com/400x500/{color}/ffffff?text=Recipe'
    
    for idx, row in df.iterrows():
        # Get ingredients and directions
        try:
            ingredients_raw = json.loads(row.get('ingredients', '[]'))
            ingredients = ingredients_raw[:10] if len(ingredients_raw) > 10 else ingredients_raw  # Limit to 10
        except:
            ingredients = []
        
        try:
            directions = json.loads(row.get('directions', '[]'))
        except:
            directions = []
        
        # Extract cuisine from source or assign randomly
        source = str(row.get('source', 'Unknown')).lower()
        cuisine = 'International'
        for c in cuisines:
            if c.lower() in source:
                cuisine = c
                break
        
        recipe = {
            'id': str(idx + 1),
            'name': str(row.get('title', f'Recipe {idx + 1}')).strip(),
            'image': get_placeholder_image(idx),
            'prepTime': f'{15 + (idx % 45)} min',  # Generate varied times
            'difficulty': difficulties[idx % 3],  # Cycle through difficulties
            'cuisine': cuisine,
            'ingredients': ingredients,
            'directions': directions,
            'source': str(row.get('source', 'Unknown')),
            'link': str(row.get('link', ''))
        }
        
        recipes.append(recipe)
    
    # Create output directory if it doesn't exist
    output_path = Path('clean')
    output_path.mkdir(exist_ok=True)
    
    # Save as JSON
    output_file = output_path / 'recipes_sample.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(recipes, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Sample dataset created: {output_file}")
    print(f"📊 Total recipes: {len(recipes)}")
    
    # Print sample
    print("\n📋 Sample recipe:")
    print(json.dumps(recipes[0], indent=2))
    
    return len(recipes)

if __name__ == "__main__":
    try:
        count = create_sample_dataset()
        print(f"\n🎉 Success! Created sample dataset with {count} recipes")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
