from __future__ import annotations

import json
import logging
import os
from decimal import Decimal
from pathlib import Path
from typing import Dict, List, Any

LOG = logging.getLogger(__name__)


def load_secrets_from_file(secrets_path: str | Path = "secrets.sh") -> None:
    """Parses simple KEY=VALUE lines from `secrets.sh` and injects into os.environ.

    Lines starting with # are ignored. Values may be quoted or unquoted.
    """
    p = Path(secrets_path)
    if not p.exists():
        LOG.debug("Secrets file %s not found; skipping load", p)
        return

    LOG.debug("Loading secrets from %s", p)
    for raw in p.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            continue
        key, val = line.split("=", 1)
        key = key.strip()
        val = val.strip().strip('"').strip("'")
        os.environ.setdefault(key, val)
        if key.startswith("AWS_"):
            display = val[:4] + "..." if val else "(empty)"
            LOG.debug("Loaded secret %s=%s", key, display)


def _get_dynamodb_table(table_name: str = "thomas-menu"):
    """Return a boto3 Table resource for `table_name` using credentials from env or secrets.sh.

    If boto3 is not installed, raises ImportError with a helpful message.
    """
    try:
        import boto3
    except Exception as exc:  # pragma: no cover - environment
        raise ImportError("boto3 is required for DynamoDB access; install with `pip install boto3`") from exc

    load_secrets_from_file(Path(__file__).parent.parent / "secrets.sh")

    aws_key = os.environ.get("AWS_ACCESS_KEY_ID")
    aws_secret = os.environ.get("AWS_SECRET_ACCESS_KEY")
    aws_token = os.environ.get("AWS_SESSION_TOKEN")
    region = os.environ.get("AWS_REGION", "us-east-2")

    LOG.debug("Creating boto3 session for region=%s; key_present=%s", region, bool(aws_key and aws_secret))
    if aws_key and aws_secret:
        session = boto3.Session(aws_access_key_id=aws_key, aws_secret_access_key=aws_secret, aws_session_token=aws_token, region_name=region)
    else:
        # Fall back to default credential provider chain
        session = boto3.Session(region_name=region)

    dynamodb = session.resource("dynamodb")
    table = dynamodb.Table(table_name)
    LOG.debug("Obtained DynamoDB table resource: %s (arn=%s)", table.table_name if hasattr(table, 'table_name') else table_name, getattr(table, 'table_arn', 'unknown'))
    return table


def fetch_ratings_for_items(ids: List[str]) -> Dict[str, Dict[str, Any]]:
    """Fetch ratings for a list of menuItemId strings from DynamoDB table `thomas-menu`.

    Returns mapping: menuItemId -> {ratingOverall, ratingToday, ratingCount}.
    If DynamoDB access fails, returns zeros for all items.
    """
    zeros = {i: {"ratingOverall": 0.0, "ratingToday": 0.0, "ratingCount": 0} for i in ids}

    try:
        table = _get_dynamodb_table("thomas-menu")
    except ImportError as exc:
        LOG.error("boto3 not available: %s", exc)
        return zeros
    except Exception:
        LOG.exception("Failed to get DynamoDB table; returning zero ratings")
        return zeros

    out: Dict[str, Dict[str, Any]] = {}

    # Determine partition key name from table key schema if possible
    pk_name = None
    try:
        key_schema = table.key_schema
        LOG.debug("Table key_schema=%s", key_schema)
        for k in key_schema:
            if k.get("KeyType") == "HASH":
                pk_name = k.get("AttributeName")
                break
    except Exception:
        LOG.debug("Unable to read table key_schema; will try default key 'ItemName'")
    if not pk_name:
        pk_name = "menuItemId"
        LOG.debug("Using default partition key name '%s'", pk_name)

    # Per-item get (keeps logic simple and robust). We could optimize with batch_get_item if needed.
    for id_val in ids:
        try:
            LOG.debug("Fetching item from DynamoDB: key=%s value=%s", pk_name, id_val)
            resp = table.get_item(Key={pk_name: str(id_val)})
            item = resp.get("Item")
            if not item:
                LOG.debug("No item found in DB for %s", id_val)
                out[id_val] = zeros[id_val]
                continue

            LOG.debug("Found item for %s: keys=%s", id_val, list(item.keys())[:10])
            # Support multiple possible attribute names for ratings
            overall = item.get("ratingOverall") or item.get("rating_overall") or item.get("rating") or 0.0
            today = item.get("ratingToday") or item.get("rating_today") or 0.0
            count = item.get("ratingCount") or item.get("rating_count") or item.get("ratingCount", 0)

            out[id_val] = {
                "ratingOverall": float(overall or 0.0),
                "ratingToday": float(today or 0.0),
                "ratingCount": int(count or 0),
            }
            LOG.debug("Parsed ratings for %s => %s", id_val, out[id_val])
        except Exception:
            LOG.exception("Error fetching item %s from DynamoDB; using zeros", id_val)
            out[id_val] = zeros[id_val]

    return out


def upload_cache_json(file_path: str) -> bool:
    """Upload cache JSON into DynamoDB table `thomas-menu`.

    For each entry in the cache (expected list of objects with `ItemName` and `Meta`),
    writes/updates an item in DynamoDB containing rating fields and optionally the Meta blob.
    """
    try:
        table = _get_dynamodb_table("thomas-menu")
    except ImportError as exc:
        LOG.error("boto3 not available: %s", exc)
        return False
    except Exception:
        LOG.exception("Failed to get DynamoDB table; aborting upload")
        return False

    p = Path(file_path)
    if not p.exists():
        LOG.warning("Cache file not found: %s", file_path)
        return False

    try:
        data = json.loads(p.read_text(encoding="utf-8"))
    except Exception:
        LOG.exception("Failed to read cache JSON: %s", file_path)
        return False

    # Use batch writer for efficient writes
    try:
        # Deduplicate by menuItemId (BatchWriteItem doesn't allow duplicate keys in one request)
        unique: Dict[str, dict] = {}
        for entry in data:
            menu_item_id = entry.get("menuItemId")
            if menu_item_id is None:
                # fallback to ItemName for legacy entries
                menu_item_id = entry.get("ItemName")
            if not menu_item_id:
                LOG.debug("Skipping entry without menuItemId/ItemName: %s", entry)
                continue
            # normalize to string for DynamoDB primary key
            unique[str(menu_item_id)] = entry

        LOG.debug("Deduplicated cache entries: original=%d unique=%d", len(data), len(unique))

        def _convert(obj):
            if isinstance(obj, float):
                return Decimal(str(obj))
            if isinstance(obj, dict):
                return {k: _convert(v) for k, v in obj.items()}
            if isinstance(obj, list):
                return [_convert(v) for v in obj]
            return obj

        # figure out partition key name
        try:
            pk_name = table.key_schema[0]["AttributeName"]
        except Exception:
            pk_name = "menuItemId"

        with table.batch_writer() as batch:
            for menu_item_id, entry in unique.items():
                meta = entry.get("Meta") or {}

                # If ratings are at top-level, prefer those, otherwise look in Meta
                rating_overall = entry.get("ratingOverall") or meta.get("ratingOverall") or meta.get("rating_overall") or 0.0
                rating_today = entry.get("ratingToday") or meta.get("ratingToday") or meta.get("rating_today") or 0.0
                rating_count = entry.get("ratingCount") or meta.get("ratingCount") or meta.get("rating_count") or 0

                item = {
                    pk_name: str(menu_item_id),
                    "ratingOverall": _convert(float(rating_overall or 0.0)),
                    "ratingToday": _convert(float(rating_today or 0.0)),
                    "ratingCount": int(rating_count or 0),
                    "Meta": _convert(meta)
                }

                LOG.debug("Queueing item for DB write: %s (keys=%s)", menu_item_id, list(item.keys())[:10])
                batch.put_item(Item=item)

        LOG.info("Uploaded cache %s to DynamoDB table %s", file_path, table.table_name)
        return True
    except Exception:
        LOG.exception("Error uploading cache to DynamoDB")
        return False


def clear_table(table_name: str = "thomas-menu") -> bool:
    """Remove all items from the DynamoDB table named `table_name`.

    This performs a scan to collect primary keys and then deletes items in
    batches. Returns True on success, False on error. Intended for test cleanup.
    """
    try:
        table = _get_dynamodb_table(table_name)
    except ImportError as exc:
        LOG.error("boto3 not available: %s", exc)
        return False
    except Exception:
        LOG.exception("Failed to get DynamoDB table; cannot clear")
        return False

    # determine partition key name
    try:
        pk_name = table.key_schema[0]["AttributeName"]
    except Exception:
        pk_name = "menuItemId"
        LOG.debug("Falling back to default PK name '%s'", pk_name)

    try:
        last_key = None
        while True:
            if last_key:
                resp = table.scan(ProjectionExpression=pk_name, ExclusiveStartKey=last_key)
            else:
                resp = table.scan(ProjectionExpression=pk_name)

            items = resp.get("Items", [])
            if not items:
                break

            with table.batch_writer() as batch:
                for it in items:
                    key_val = it.get(pk_name)
                    if key_val is None:
                        continue
                    batch.delete_item(Key={pk_name: key_val})

            last_key = resp.get("LastEvaluatedKey")
            if not last_key:
                break

        LOG.info("Cleared all items from DynamoDB table %s", getattr(table, 'table_name', table_name))
        return True
    except Exception:
        LOG.exception("Failed to clear DynamoDB table %s", table_name)
        return False
