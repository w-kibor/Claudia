# Example Kaggle dataset placement guide

Place your downloaded Kaggle CSV file here.

## Steps:

1. Go to https://www.kaggle.com/datasets
2. Search for "recipes" or similar
3. Download the CSV file (you need a Kaggle account)
4. Extract and rename to `recipes.csv`
5. Place in this directory
6. Run: `python ../scripts/etl_script.py --input recipes.csv --output ../clean/recipes_processed.json`

## File Format

Expected CSV structure (columns will be auto-detected):
- name/title: Recipe name
- prep_time: Preparation time
- cook_time: Cooking time
- ingredients: List of ingredients
- instructions: Cooking instructions
- cuisine: Recipe cuisine type
- difficulty: Difficulty level
- image_url: URL to recipe image

The ETL script is flexible and handles various column name formats!
