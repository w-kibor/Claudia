#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
resolve_path() {
  local path="$1"

  if [[ "$path" = /* ]]; then
    printf '%s\n' "$path"
  else
    printf '%s\n' "$ROOT_DIR/$path"
  fi
}

INPUT_PATH="$(resolve_path "${INPUT_PATH:-raw/recipes_data.csv}")"
OUTPUT_PATH="$(resolve_path "${OUTPUT_PATH:-clean/recipes_data.json}")"
QUALITY_REPORT_PATH="$(resolve_path "${QUALITY_REPORT_PATH:-clean/recipes_data.quality.json}")"
LOG_FILE="$(resolve_path "${LOG_FILE:-output/etl.log}")"
SOURCE_NAME="${SOURCE_NAME:-Kaggle Recipes Dataset}"
LOG_LEVEL="${LOG_LEVEL:-INFO}"
BATCH_LOG_INTERVAL="${BATCH_LOG_INTERVAL:-500}"
MAX_ERRORS="${MAX_ERRORS:-100}"
FAIL_ON_QUALITY="${FAIL_ON_QUALITY:-false}"

mkdir -p "$(dirname "$OUTPUT_PATH")" "$(dirname "$QUALITY_REPORT_PATH")" "$(dirname "$LOG_FILE")"

CMD=(
  python3 "$ROOT_DIR/scripts/etl_script.py"
  --input "$INPUT_PATH"
  --output "$OUTPUT_PATH"
  --quality-report "$QUALITY_REPORT_PATH"
  --source-name "$SOURCE_NAME"
  --log-level "$LOG_LEVEL"
  --batch-log-interval "$BATCH_LOG_INTERVAL"
  --max-errors "$MAX_ERRORS"
  --log-file "$LOG_FILE"
)

if [[ "$FAIL_ON_QUALITY" == "true" ]]; then
  CMD=("${CMD[@]}" --fail-on-quality)
fi

printf 'Running ETL with input=%s output=%s quality_report=%s\n' "$INPUT_PATH" "$OUTPUT_PATH" "$QUALITY_REPORT_PATH"
"${CMD[@]}"
