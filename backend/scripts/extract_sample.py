import json
import os

source_file = r'c:\Users\ELITEBOOK\Desktop\Data Engineering projects\Claudia\data-pipeline\clean\recipes_sample.json'
target_file = r'c:\Users\ELITEBOOK\Desktop\Data Engineering projects\Claudia\backend\data\recipes_small.json'
limit = 1000

print(f"Reading {source_file}...")

try:
    with open(source_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    if 'recipes' in data:
        print(f"Found {len(data['recipes'])} recipes. Extracting {limit}...")
        subset = {'recipes': data['recipes'][:limit]}
        
        os.makedirs(os.path.dirname(target_file), exist_ok=True)
        with open(target_file, 'w', encoding='utf-8') as f:
            json.dump(subset, f, indent=2)
            
        print(f"Successfully extracted {limit} recipes to {target_file}")
    else:
        print("JSON structure is not as expected. 'recipes' array not found.")

except Exception as e:
    print(f"Error: {str(e)}")
