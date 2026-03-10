# Processed Recipe Data Output

This directory contains the cleaned and structured JSON output from the ETL pipeline.

## Output Format

Each file contains processed recipes in this structure:

```json
{
  "recipes": [...],
  "metadata": {
    "total": number,
    "source": string,
    "processedAt": ISO-8601 timestamp
  }
}
```

Ready to be loaded into:
- 🗄️ Database (MySQL/PostgreSQL)
- 📱 Frontend API
- 🔍 Search indices
- 📊 Data visualization
