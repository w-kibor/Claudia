#!/usr/bin/env python3
"""Reproducible ETL pipeline for Claudia recipe data."""

import argparse
import csv
import hashlib
import json
import logging
import re
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple


LOGGER = logging.getLogger("recipe_etl")


@dataclass
class PipelineConfig:
    input_path: Path
    output_path: Path
    quality_report_path: Path
    source_name: str
    batch_log_interval: int
    fail_on_quality: bool
    max_errors: int


def setup_logging(level: str, log_file: Optional[Path]) -> None:
    numeric_level = getattr(logging, level.upper(), logging.INFO)
    formatter = logging.Formatter(
        "%(asctime)s %(levelname)s [%(name)s] %(message)s",
        datefmt="%Y-%m-%dT%H:%M:%SZ",
    )

    stream_handler = logging.StreamHandler(sys.stdout)
    stream_handler.setFormatter(formatter)

    LOGGER.setLevel(numeric_level)
    LOGGER.handlers = [stream_handler]

    if log_file:
        log_file.parent.mkdir(parents=True, exist_ok=True)
        file_handler = logging.FileHandler(log_file, encoding="utf-8")
        file_handler.setFormatter(formatter)
        LOGGER.addHandler(file_handler)


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def normalize_text(value: Optional[str]) -> str:
    return (value or "").strip()


def parse_time(time_str: Optional[str]) -> Optional[int]:
    if not time_str:
        return None

    time_str = normalize_text(str(time_str)).lower()

    match = re.search(r"(\d+)\s*(?:minutes?|mins?)", time_str)
    if match:
        return int(match.group(1))

    match = re.search(r"(\d+)\s*(?:hours?|hrs?)", time_str)
    if match:
        return int(match.group(1)) * 60

    try:
        return int(time_str)
    except ValueError:
        return None


def parse_servings(servings_str: Optional[str]) -> Optional[int]:
    if not servings_str:
        return None

    match = re.search(r"(\d+)", str(servings_str))
    if match:
        return int(match.group(1))
    return None


def parse_difficulty(difficulty_str: Optional[str]) -> str:
    difficulty = normalize_text(difficulty_str).lower()
    if not difficulty:
        return "Medium"
    if any(word in difficulty for word in ["easy", "simple", "beginner"]):
        return "Easy"
    if any(word in difficulty for word in ["hard", "difficult", "advanced"]):
        return "Hard"
    return "Medium"


def get_field(row: Dict[str, str], *keys: str) -> str:
    for key in keys:
        if key in row and row[key] is not None:
            return normalize_text(str(row[key]))
    return ""


def stable_recipe_id(title: str, source: str, link: str, row_num: int) -> str:
    identity = "|".join([title.lower(), source.lower(), link.lower()])
    digest = hashlib.sha1(identity.encode("utf-8")).hexdigest()[:12]
    if digest == hashlib.sha1("||".encode("utf-8")).hexdigest()[:12]:
        return f"recipe-{row_num}"
    return f"recipe-{digest}"


def parse_csv_row(row: Dict[str, str], row_num: int, source_name: str) -> Optional[Dict[str, Any]]:
    try:
        title = get_field(row, "name", "title", "recipe_name") or f"Recipe {row_num}"
        source = get_field(row, "source", "website") or source_name
        link = get_field(row, "url", "link")

        created_at = utc_now_iso()
        recipe = {
            "id": stable_recipe_id(title=title, source=source, link=link, row_num=row_num),
            "title": title,
            "description": get_field(row, "description", "summary", "instructions") or None,
            "imageUrl": get_field(row, "image_url", "imageurl", "image", "thumbnail") or "",
            "prepTime": parse_time(get_field(row, "prep_time", "preptime", "prep")) or 0,
            "cookTime": parse_time(get_field(row, "cook_time", "cooktime", "cook")) or 0,
            "servings": parse_servings(get_field(row, "servings", "serves")) or 4,
            "difficulty": parse_difficulty(get_field(row, "difficulty", "level")),
            "cuisine": get_field(row, "cuisine", "cuisines") or None,
            "dishType": get_field(row, "category", "dish_type", "type", "course") or None,
            "calories": int(get_field(row, "calories", "cal")) if get_field(row, "calories", "cal") else None,
            "source": source,
            "tags": [
                tag.strip()
                for tag in get_field(row, "tags", "keywords", "categories").split(",")
                if tag.strip()
            ],
            "rating": float(get_field(row, "rating", "score")) if get_field(row, "rating", "score") else None,
            "link": link or None,
            "createdAt": created_at,
            "updatedAt": created_at,
        }
        return recipe
    except Exception as exc:
        LOGGER.error("row=%s parse_error=%s", row_num, str(exc))
        return None


def validate_schema(recipe: Dict[str, Any]) -> List[str]:
    issues: List[str] = []
    if not isinstance(recipe.get("id"), str) or not recipe["id"].strip():
        issues.append("id must be a non-empty string")
    if not isinstance(recipe.get("title"), str) or not recipe["title"].strip():
        issues.append("title must be a non-empty string")
    if not isinstance(recipe.get("prepTime"), int) or recipe["prepTime"] < 0:
        issues.append("prepTime must be an integer >= 0")
    if not isinstance(recipe.get("cookTime"), int) or recipe["cookTime"] < 0:
        issues.append("cookTime must be an integer >= 0")
    if not isinstance(recipe.get("servings"), int) or recipe["servings"] <= 0:
        issues.append("servings must be an integer > 0")
    if recipe.get("difficulty") not in {"Easy", "Medium", "Hard"}:
        issues.append("difficulty must be Easy, Medium, or Hard")
    if not isinstance(recipe.get("tags"), list):
        issues.append("tags must be an array")
    return issues


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as file_handle:
        for chunk in iter(lambda: file_handle.read(65536), b""):
            digest.update(chunk)
    return digest.hexdigest()


def process_csv(config: PipelineConfig) -> Tuple[Dict[str, Any], Dict[str, Any]]:
    if not config.input_path.exists():
        raise FileNotFoundError(f"Input file not found: {config.input_path}")

    config.output_path.parent.mkdir(parents=True, exist_ok=True)
    config.quality_report_path.parent.mkdir(parents=True, exist_ok=True)

    recipes: List[Dict[str, Any]] = []
    seen_ids: Set[str] = set()
    seen_keys: Set[str] = set()

    quality_report: Dict[str, Any] = {
        "runAt": utc_now_iso(),
        "inputFile": str(config.input_path),
        "inputSha256": file_sha256(config.input_path),
        "rowCount": 0,
        "processedCount": 0,
        "parseErrorCount": 0,
        "schemaErrorCount": 0,
        "duplicateIdCount": 0,
        "duplicateRecipeCount": 0,
        "nullCounts": {
            "title": 0,
            "description": 0,
            "imageUrl": 0,
            "cuisine": 0,
            "dishType": 0,
            "source": 0,
        },
        "sampleIssues": [],
    }

    LOGGER.info("starting_etl input=%s output=%s", config.input_path, config.output_path)

    with config.input_path.open("r", encoding="utf-8") as file_handle:
        csv_reader = csv.DictReader(file_handle)

        for row_num, row in enumerate(csv_reader, start=1):
            quality_report["rowCount"] += 1
            recipe = parse_csv_row(row, row_num, config.source_name)
            if recipe is None:
                quality_report["parseErrorCount"] += 1
                continue

            issues = validate_schema(recipe)
            if issues:
                quality_report["schemaErrorCount"] += 1
                quality_report["sampleIssues"].append({"row": row_num, "issues": issues})
                if len(quality_report["sampleIssues"]) > config.max_errors:
                    quality_report["sampleIssues"] = quality_report["sampleIssues"][: config.max_errors]

            if recipe["id"] in seen_ids:
                quality_report["duplicateIdCount"] += 1
            seen_ids.add(recipe["id"])

            dedupe_key = "|".join(
                [
                    normalize_text(recipe.get("title", "")).lower(),
                    normalize_text(recipe.get("source", "")).lower(),
                ]
            )
            if dedupe_key in seen_keys:
                quality_report["duplicateRecipeCount"] += 1
            seen_keys.add(dedupe_key)

            for field in quality_report["nullCounts"]:
                value = recipe.get(field)
                if value in (None, ""):
                    quality_report["nullCounts"][field] += 1

            recipes.append(recipe)
            quality_report["processedCount"] += 1

            if row_num % config.batch_log_interval == 0:
                LOGGER.info("progress rows=%s processed=%s", row_num, quality_report["processedCount"])

    metadata = {
        "total": len(recipes),
        "source": config.source_name,
        "processedAt": utc_now_iso(),
        "inputSha256": quality_report["inputSha256"],
    }

    with config.output_path.open("w", encoding="utf-8") as output_file:
        json.dump({"recipes": recipes, "metadata": metadata}, output_file, indent=2)

    with config.quality_report_path.open("w", encoding="utf-8") as quality_file:
        json.dump(quality_report, quality_file, indent=2)

    LOGGER.info("etl_complete total=%s output=%s", len(recipes), config.output_path)
    LOGGER.info("quality_report_written path=%s", config.quality_report_path)

    return metadata, quality_report


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Reproducible ETL pipeline for Claudia")
    parser.add_argument("--input", "-i", required=True, help="Input CSV file path")
    parser.add_argument("--output", "-o", required=True, help="Output JSON file path")
    parser.add_argument(
        "--quality-report",
        "-q",
        help="Path for data quality report JSON (default: <output>.quality.json)",
    )
    parser.add_argument(
        "--source-name",
        default="Kaggle Recipes Dataset",
        help="Source name to use when source is missing",
    )
    parser.add_argument(
        "--batch-log-interval",
        type=int,
        default=500,
        help="Log progress every N rows",
    )
    parser.add_argument(
        "--log-level",
        default="INFO",
        choices=["DEBUG", "INFO", "WARNING", "ERROR"],
        help="Logging verbosity",
    )
    parser.add_argument("--log-file", help="Optional path for log file")
    parser.add_argument(
        "--max-errors",
        type=int,
        default=100,
        help="Maximum sample issues to keep in report",
    )
    parser.add_argument(
        "--fail-on-quality",
        action="store_true",
        help="Exit with status 1 when quality checks detect issues",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    output_path = Path(args.output)
    quality_report_path = (
        Path(args.quality_report)
        if args.quality_report
        else output_path.with_suffix(f"{output_path.suffix}.quality.json")
    )
    log_file_path = Path(args.log_file) if args.log_file else None

    setup_logging(args.log_level, log_file_path)

    config = PipelineConfig(
        input_path=Path(args.input),
        output_path=output_path,
        quality_report_path=quality_report_path,
        source_name=args.source_name,
        batch_log_interval=max(1, args.batch_log_interval),
        fail_on_quality=args.fail_on_quality,
        max_errors=max(1, args.max_errors),
    )

    try:
        metadata, quality_report = process_csv(config)
    except Exception as exc:
        LOGGER.error("pipeline_failed error=%s", str(exc))
        sys.exit(1)

    LOGGER.info(
        "summary total=%s processed=%s parse_errors=%s schema_errors=%s duplicate_ids=%s duplicate_recipes=%s",
        quality_report["rowCount"],
        quality_report["processedCount"],
        quality_report["parseErrorCount"],
        quality_report["schemaErrorCount"],
        quality_report["duplicateIdCount"],
        quality_report["duplicateRecipeCount"],
    )

    quality_issue_count = (
        quality_report["parseErrorCount"]
        + quality_report["schemaErrorCount"]
        + quality_report["duplicateIdCount"]
    )
    if config.fail_on_quality and quality_issue_count > 0:
        LOGGER.error("quality_gate_failed issues=%s", quality_issue_count)
        sys.exit(1)

    LOGGER.info("pipeline_succeeded output_total=%s", metadata["total"])


if __name__ == "__main__":
    main()
