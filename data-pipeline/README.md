# Data Pipeline - Claudia Recipe ETL

Documentation for the data engineering pipeline that processes Kaggle recipe datasets.

## Overview

The ETL (Extract, Transform, Load) pipeline processes raw Kaggle CSV files into clean, structured JSON that can be loaded into the database.

```
Raw CSV → Parser → Normalizer → Structured JSON → Database
```

## 📁 Directory Structure

```
data-pipeline/
├── raw/              # Drop your Kaggle CSVs here
├── clean/            # Output processed JSON files
├── scripts/
│   └── etl_script.py # Main ETL script
└── README.md         # This file
```

## Quick Start

### Prerequisites
- Python 3.8+
- pip

### Running the ETL

```bash
# Navigate to data-pipeline
cd data-pipeline

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Recommended: run through the reproducible wrapper
bash scripts/run_etl.sh

# Or run ETL script directly
python scripts/etl_script.py \
  --input raw/your_recipes.csv \
  --output clean/recipes.json \
  --quality-report clean/recipes.quality.json \
  --log-file output/etl.log \
  --fail-on-quality
```

## Reproducible Configuration

The wrapper script `scripts/run_etl.sh` accepts environment variables, so local, cron,
and CI runs use the exact same command path.

```bash
INPUT_PATH=data-pipeline/raw/recipes_data.csv \
OUTPUT_PATH=data-pipeline/clean/recipes_data.json \
QUALITY_REPORT_PATH=data-pipeline/clean/recipes_data.quality.json \
LOG_FILE=data-pipeline/output/etl.log \
FAIL_ON_QUALITY=true \
bash data-pipeline/scripts/run_etl.sh
```

Supported environment variables:

- `INPUT_PATH`
- `OUTPUT_PATH`
- `QUALITY_REPORT_PATH`
- `LOG_FILE`
- `SOURCE_NAME`
- `LOG_LEVEL`
- `BATCH_LOG_INTERVAL`
- `MAX_ERRORS`
- `FAIL_ON_QUALITY` (`true` or `false`)

## 📋 CSV Column Support

The script automatically detects and normalizes columns. It supports multiple variations:

### Recipe Title
- `name`, `title`, `recipe_name`

### Cook Times
- `prep_time`, `preptime`, `prep` → minutes
- `cook_time`, `cooktime`, `cook` → minutes
- Supports formats: "30 minutes", "1 hour", "45", etc.

### Servings
- `servings`, `serves` → number (default: 4)

### Difficulty
- `difficulty`, `level` → normalized to Easy/Medium/Hard

### Cuisine & Type
- `cuisine`, `cuisines` → string
- `category`, `dish_type`, `type`, `course` → string

### Images
- `image_url`, `imageurl`, `image`, `url`

### Ingredients & Instructions
- `ingredients`, `instructions`, `steps`

### Metadata
- `rating`, `score` → float (0-5)
- `calories`, `cal` → integer
- `tags`, `keywords`, `categories` → array (comma-separated)
- `source`, `website` → string

## 📊 Output Format

The script generates JSON in the following format:

```json
{
  "recipes": [
    {
      "id": "recipe-1",
      "title": "Pad Thai with Shrimp",
      "description": "...",
      "imageUrl": "https://...",
      "prepTime": 15,
      "cookTime": 15,
      "servings": 4,
      "difficulty": "Medium",
      "cuisine": "Thai",
      "dishType": "Main Course",
      "ingredients": [
        {
          "id": "ing-1",
          "name": "Rice Noodles",
          "quantity": "8",
          "unit": "oz",
          "optional": false
        }
      ],
      "instructions": [
        {
          "id": "instr-1",
          "step": 1,
          "description": "...",
          "timeRequired": 10
        }
      ],
      "tips": ["..."],
      "calories": 320,
      "rating": 4.8,
      "tags": ["Asian", "Quick"],
      "source": "Kaggle Dataset",
      "createdAt": "2024-02-28T...",
      "updatedAt": "2024-02-28T..."
    }
  ],
  "metadata": {
    "total": 1,
    "source": "Kaggle Recipes Dataset",
    "processedAt": "2024-02-28T..."
  }
}
```

## Script Parameters

```bash
python scripts/etl_script.py --help

Options:
  -i, --input   INPUT     Path to input CSV file (required)
  -o, --output  OUTPUT    Path to output JSON file (required)
  -q, --quality-report    Path to quality report JSON (optional)
      --source-name       Source name fallback
      --batch-log-interval Progress log interval in rows
      --log-level         DEBUG|INFO|WARNING|ERROR
      --log-file          Optional log file path
      --max-errors        Maximum number of sample issues in report
      --fail-on-quality   Exit non-zero when quality issues are detected
```

## Data Quality Checks

The script performs:
- Column name detection and normalization
- Type conversion (times to integers, ratings to floats)
- Null counting for selected fields
- Duplicate detection (stable ID and title+source)
- Schema checks for key fields and types
- Structured quality report output

Quality report example fields:

- `rowCount`, `processedCount`, `parseErrorCount`
- `schemaErrorCount`, `duplicateIdCount`, `duplicateRecipeCount`
- `nullCounts`
- `sampleIssues`

## Processing Statistics

The script outputs:
```
2026-03-20T03:00:00Z INFO [recipe_etl] summary total=1000 processed=998 parse_errors=2 schema_errors=0 duplicate_ids=0 duplicate_recipes=12
```

## Scheduling

### GitHub Actions

Workflow file: `.github/workflows/data-pipeline.yml`

- Scheduled daily at `03:00 UTC`
- Manual runs supported via `workflow_dispatch`
- Uploads `clean/*.json` and `output/*.log` as artifacts

Optional repository variables:

- `PIPELINE_INPUT_PATH`
- `PIPELINE_OUTPUT_PATH`
- `PIPELINE_QUALITY_REPORT_PATH`

### Cron (Linux)

Example cron entry to run every day at 03:00:

```cron
0 3 * * * cd /path/to/repo && FAIL_ON_QUALITY=true bash data-pipeline/scripts/run_etl.sh >> data-pipeline/output/cron.log 2>&1
```

## 🐛 Troubleshooting

### "Input file not found"
- Ensure the CSV path is correct
- Place CSV in `raw/` directory
- Use absolute paths or paths relative to the script

### "Encoding error"
- CSV must be UTF-8 encoded
- Try: `iconv -f ISO-8859-1 -t UTF-8 input.csv > output.csv`

### Missing data in output
- Check column names in your CSV
- Refer to "CSV Column Support" section
- Script will use fallback values for missing optional fields

## Bulk Processing

To process multiple files:

```bash
#!/bin/bash
for file in raw/*.csv; do
  output_name=$(basename "$file" .csv)
  python scripts/etl_script.py \
    --input "$file" \
    --output "clean/${output_name}.json"
done
```

## Kaggle Datasets

Recommended recipe datasets:
1. [Recipes Dataset](https://www.kaggle.com/datasets/kaggle/recipe-ingredients-dataset)
2. [Recipe Ingredients Dataset](https://www.kaggle.com/datasets/zynicide/recipe-ingredients-dataset)
3. [Food Culture and Recipes](https://www.kaggle.com/datasets/huynhcongtu2505/food-culture-and-recipes)

## Next Steps

1. Download a Kaggle recipes CSV
2. Place in `raw/` folder
3. Run ETL script
4. Load JSON into database
5. Use in frontend with RecipeCard component

---

Reliable ETL depends on deterministic inputs, logged runs, and automated schedules.
