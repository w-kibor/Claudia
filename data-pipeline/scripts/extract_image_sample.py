import json
import csv

input_file = r'c:\Users\ELITEBOOK\Desktop\Data Engineering projects\Claudia\data-pipeline\raw\recipes_data.csv'
output_file = r'c:\Users\ELITEBOOK\Desktop\Data Engineering projects\Claudia\backend\data\recipes_small.json'

print(f"Reading from {input_file} to find recipes WITH images...")

recipes = []
count = 0
total_scanned = 0

with open(input_file, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    try:
        headers = next(reader)
    except StopIteration:
        print("Empty file")
        exit(1)
        
    print(f"Headers: {headers}")
    
    for row in reader:
        total_scanned += 1
        
        if count >= 1000:
            break
            
        if len(row) < len(headers):
            continue
            
        row_dict = dict(zip(headers, row))
        
        # Look for images in NER, source, or link if they exist, but usually Kaggle datasets
        # might have a specific image column. Let's check available columns.
        
        # If no image column exists, the dataset might not have images at all.
        # Let's check for any column that might contain 'http' and '.jpg'/'.png'
        image_url = ''
        
        for key, value in row_dict.items():
            if 'http' in str(value) and ('.jpg' in str(value).lower() or '.png' in str(value).lower()):
                image_url = value
                break
                
        # If dataset lacks images entirely, we can't extract them. 
        # But let's only keep recipes that actually have an image_url if we found one.
        if not image_url:
            # Check if there's an explicit image column we missed
            if 'image' in row_dict and row_dict['image']:
                image_url = row_dict['image']
            elif 'imageUrl' in row_dict and row_dict['imageUrl']:
                image_url = row_dict['imageUrl']
            elif 'image_url' in row_dict and row_dict['image_url']:
                image_url = row_dict['image_url']
            elif 'picture' in row_dict and row_dict['picture']:
                image_url = row_dict['picture']
                
        if not image_url:
            continue  # Skip this recipe if it has no image
            
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
            'imageUrl': image_url
        }
        
        recipes.append(recipe)
        count += 1

print(f"Scanned {total_scanned} rows.")
print(f"Extracted {len(recipes)} recipes with images from the CSV. Saving to {output_file}...")

with open(output_file, 'w', encoding='utf-8') as out:
    json.dump({'recipes': recipes}, out, indent=2)
    
print("Done!")
