import json
import csv
import os

input_file = r'c:\Users\ELITEBOOK\Desktop\Data Engineering projects\Claudia\data-pipeline\raw\recipes_data.csv'
output_file = r'c:\Users\ELITEBOOK\Desktop\Data Engineering projects\Claudia\backend\data\recipes_small.json'

print(f"Reading from {input_file}")

recipes = []
count = 0

with open(input_file, 'r', encoding='utf-8') as f:
    # Attempt to read headers
    reader = csv.reader(f)
    headers = next(reader)
    print(f"Headers: {headers}")
    
    # Typical Kaggle recipes dataset columns: ['title', 'ingredients', 'directions', 'link', 'source', 'NER']
    
    for row in reader:
        if count >= 1000:
            break
            
        if len(row) < len(headers):
            continue
            
        row_dict = dict(zip(headers, row))
        
        # Parse ingredients
        try:
            ingredients = json.loads(row_dict.get('ingredients', '[]'))
        except:
            ingredients = []
            
        # Parse directions
        try:
            directions = json.loads(row_dict.get('directions', '[]'))
        except:
            directions = []
            
        recipe = {
            'id': f"recipe-{count+1}",
            'title': row_dict.get('title', f"Recipe {count+1}"),
            'ingredients': ingredients,
            'directions': directions,
            'source': row_dict.get('source', 'Kaggle Dataset'),
            'link': row_dict.get('link', ''),
            'cuisine': None,
            'prepTime': 0,
            'cookTime': 0,
            'difficulty': 'Medium',
            'imageUrl': ''
        }
        
        recipes.append(recipe)
        count += 1

print(f"Extracted {len(recipes)} recipes from the CSV. Saving to {output_file}...")

with open(output_file, 'w', encoding='utf-8') as out:
    json.dump({'recipes': recipes}, out, indent=2)
    
print("Done!")
