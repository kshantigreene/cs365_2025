"""
Consolidated helper functions for the RateMyMeal backend.

Core functionality:
- API polling and raw JSON handling
- Parsing raw JSON into FoodItem objects
- Cache management (read/write with ratings)
- Database operations (fetch/update ratings)
- Food item management
"""

from __future__ import annotations

import json
import logging
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any

from backend.models import FoodItem
from backend.APIs import database_api

LOG = logging.getLogger(__name__)


# ============================================================================
# Date/Time Utilities
# ============================================================================

def get_current_date_str() -> str:
    """Returns the current date as a string in 'YYYY-MM-DD' format."""
    return datetime.now().strftime('%Y-%m-%d')


def get_date_from_cache_filename(path: str) -> str | None:
    """Extract a YYYY-MM-DD date from cache filenames like `thomas_menu-YYYY-MM-DD.json`.

    Returns the date string or None if not found.
    """
    import re
    m = re.search(r'thomas_menu-(\d{4}-\d{2}-\d{2})', str(path))
    if m:
        return m.group(1)
    return None


def read_cache_date(file_path: str) -> str | None:
    """Read the cache date embedded in a cache JSON file.

    Behavior:
    - If the file contains an array of items where each item has Meta.cacheDate, returns the first one found.
    - Otherwise falls back to parsing the date from the filename using `get_date_from_cache_filename`.
    Returns None when date can't be determined.
    """
    p = Path(file_path)
    if not p.exists():
        return None
    try:
        payload = json.loads(p.read_text(encoding="utf-8"))
    except Exception:
        return get_date_from_cache_filename(str(p))

    # payload expected to be a list of items
    if isinstance(payload, list) and payload:
        first = payload[0]
        meta = first.get("Meta") if isinstance(first, dict) else None
        if meta and isinstance(meta, dict):
            cache_date = meta.get("cacheDate") or meta.get("cache_date")
            if cache_date:
                return str(cache_date)

    return get_date_from_cache_filename(str(p))


def set_cache_date(file_path: str, date_str: str) -> bool:
    """Set the cache date for a cache JSON file by adding `cacheDate` into each item's `Meta`.

    This leaves the overall file structure (list of items) intact so frontends that
    iterate the list do not break. Returns True on success.
    """
    p = Path(file_path)
    if not p.exists():
        return False
    try:
        payload = json.loads(p.read_text(encoding="utf-8"))
    except Exception:
        return False

    if not isinstance(payload, list):
        return False

    changed = False
    for entry in payload:
        if not isinstance(entry, dict):
            continue
        meta = entry.get("Meta")
        if meta is None or not isinstance(meta, dict):
            meta = {}
            entry["Meta"] = meta
        if meta.get("cacheDate") != date_str:
            meta["cacheDate"] = date_str
            changed = True

    if changed:
        try:
            p.write_text(json.dumps(payload, indent=2), encoding="utf-8")
            return True
        except Exception:
            return False
    return True


# ============================================================================
# API and Raw JSON Handling
# ============================================================================

def poll_api_to_raw(date_str: str, raw_path: str | Path) -> Path:
    """Poll Thomas API for `date_str` and save raw JSON to `raw_path`.

    Returns the Path written.
    """
    from backend.APIs.thomas_menu import ThomasMenu
    tm = ThomasMenu()
    payload = tm.get_menu(date_str)
    p = Path(raw_path)
    p.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    return p


# ============================================================================
# Parsing and Object Conversion
# ============================================================================

def parse_raw_to_objects(raw_path: str | Path) -> List[FoodItem]:
    """Parse a raw Thomas menu JSON file into a list of `FoodItem` objects.

    Uses `ThomasMenu` parsing logic by instantiating it with the `raw_path`.
    """
    from backend.APIs.thomas_menu import ThomasMenu
    p = Path(raw_path)
    if not p.exists():
        return []
    tm = ThomasMenu(p)
    return tm.parse_food_items()


def _fooditem_to_cache_entry(fi: FoodItem) -> Dict[str, Any]:
    """Convert a FoodItem dataclass to a cache entry dictionary with ratings."""
    j = fi.to_json()
    # attach contextual keys used by frontend and DB
    if getattr(fi, "menuItemId", None) is not None:
        j["menuItemId"] = str(getattr(fi, "menuItemId"))
    j["ItemName"] = fi.name
    j["meal"] = fi.meal
    j["group"] = fi.group
    # rating fields
    j["ratingOverall"] = float(getattr(fi, "overallRating", 0.0))
    j["ratingToday"] = float(getattr(fi, "todayRating", 0.0))
    j["ratingCount"] = int(len(getattr(fi, "reviews", [])))
    # keep Meta for backwards compatibility
    j.setdefault("Meta", j.copy())
    return j


# ============================================================================
# Cache File Operations
# ============================================================================

def write_cache_from_fooditems(food_items: List[FoodItem], output_path: str | Path) -> Path:
    """Write a new cache JSON from `food_items` including rating fields.

    Returns the Path written.
    """
    p = Path(output_path)
    entries = [_fooditem_to_cache_entry(fi) for fi in food_items]
    p.write_text(json.dumps(entries, indent=2), encoding="utf-8")
    return p


def get_food_items_from_cache(cache_path: str | Path) -> List[FoodItem]:
    """Load cache JSON and return a list of `FoodItem` objects.

    This converts cache entries (which may be enriched) back into FoodItem dataclasses.
    """
    p = Path(cache_path)
    if not p.exists():
        return []
    try:
        data = json.loads(p.read_text(encoding="utf-8"))
    except Exception:
        return []

    out: List[FoodItem] = []
    for entry in data:
        meta = entry.get("Meta") or entry
        name = entry.get("menuItemId") or entry.get("ItemName") or meta.get("formalName") or ""
        fi = FoodItem(
            meal=entry.get("Meal") or entry.get("meal") or meta.get("meal") or "",
            group=entry.get("group") or meta.get("group") or "",
            name=str(entry.get("ItemName") or meta.get("formalName") or name),
            description=str(meta.get("description") or ""),
            ingredients=(meta.get("ingredients") or "").split("; ") if isinstance(meta.get("ingredients"), str) else meta.get("ingredients") or [],
            allergens=[a.get("name") if isinstance(a, dict) else str(a) for a in (meta.get("allergens") or [])],
            calories=int(meta.get("calories") or 0) if str(meta.get("calories") or "").isdigit() else 0,
            caloriesFromFat=int(meta.get("caloriesFromFat") or 0) if str(meta.get("caloriesFromFat") or "").isdigit() else 0,
            fat=str(meta.get("fat") or ""),
            saturatedFat=str(meta.get("saturatedFat") or ""),
            transFat=str(meta.get("transFat") or ""),
            polyunsaturatedFat=str(meta.get("polyunsaturatedFat") or ""),
            cholesterol=str(meta.get("cholesterol") or ""),
            sodium=str(meta.get("sodium") or ""),
            carbohydrates=str(meta.get("carbohydrates") or ""),
            dietaryFiber=str(meta.get("dietaryFiber") or ""),
            sugar=str(meta.get("sugar") or ""),
            protein=str(meta.get("protein") or ""),
            potassium=str(meta.get("potassium") or ""),
            iron=str(meta.get("iron") or ""),
            calcium=str(meta.get("calcium") or ""),
            vitaminA=str(meta.get("vitaminA") or ""),
            vitaminC=str(meta.get("vitaminC") or ""),
            vitaminD=str(meta.get("vitaminD") or ""),
            portionSize=str(meta.get("portionSize") or ""),
            portion=str(meta.get("portion") or ""),
            isVegan=bool(meta.get("isVegan") or False),
            isVegetarian=bool(meta.get("isVegetarian") or False),
            isMindful=bool(meta.get("isMindful") or False),
            isSwell=bool(meta.get("isSwell") or False),
            isPlantBased=bool(meta.get("isPlantBased") or False),
        )
        # attach menuItemId if present
        menu_id = entry.get("menuItemId") or entry.get("id") or entry.get("ItemName")
        if menu_id is not None:
            setattr(fi, "menuItemId", str(menu_id))

        # attach ratings if present on entry
        try:
            fi.overallRating = float(entry.get("ratingOverall") or meta.get("ratingOverall") or 0.0)
            fi.todayRating = float(entry.get("ratingToday") or meta.get("ratingToday") or 0.0)
        except Exception:
            fi.overallRating = 0.0
            fi.todayRating = 0.0

        out.append(fi)
    return out


def find_cache_file_for_date(date_str: str, search_dir: str | Path | None = None) -> str | None:
    """Return a path to a cache JSON matching `thomas_menu-{date_str}.json` or similar.

    Searches `search_dir` (defaults to backend/) for common cache filenames and
    returns the first match as a string path, or None when not found.
    """
    if search_dir is None:
        search_dir = Path(__file__).parent
    else:
        search_dir = Path(search_dir)

    candidates = [
        f"thomas_menu-{date_str}.json",
        f"raw_thomas_menu-{date_str}.json",
        f"thomas_menu_{date_str}.json",
        f"thomas_menu.json",
    ]

    for name in candidates:
        p = search_dir / name
        if p.exists():
            return str(p)
    # fallback: try any file that contains the date in its name
    for p in search_dir.iterdir():
        if date_str in p.name and p.suffix == ".json":
            return str(p)
    return None


# ============================================================================
# Food Item Management
# ============================================================================

def get_food_item_from_cache(cache_path: str | Path, menu_item_id: str | None = None, name: str | None = None) -> FoodItem | None:
    """Return a single FoodItem from `cache_path` matching `menu_item_id` or `name`.

    Returns None when not found or on error.
    """
    items = get_food_items_from_cache(cache_path)
    if not items:
        return None
    if menu_item_id is not None:
        for fi in items:
            if getattr(fi, "menuItemId", None) is not None and str(getattr(fi, "menuItemId")) == str(menu_item_id):
                return fi
    if name is not None:
        for fi in items:
            if fi.name == name:
                return fi
    return None


def save_food_item_to_cache(food_item: FoodItem, cache_path: str | Path) -> bool:
    """Update or append a single FoodItem into the cache JSON.

    If a FoodItem with the same menuItemId or name exists, it is replaced (no duplicates).
    Otherwise, the item is appended. Returns True on success.
    """
    p = Path(cache_path)
    data = []
    if p.exists():
        try:
            data = json.loads(p.read_text(encoding="utf-8"))
        except Exception:
            data = []

    # Build new entry for this FoodItem
    new_entry = _fooditem_to_cache_entry(food_item)

    # Try to find existing by menuItemId or ItemName
    replaced = False
    for idx, entry in enumerate(data):
        mid = entry.get("menuItemId") or entry.get("id") or entry.get("ItemName")
        if mid is not None and getattr(food_item, "menuItemId", None) is not None and str(mid) == str(getattr(food_item, "menuItemId")):
            data[idx] = new_entry
            replaced = True
            break
        # fallback to match by name
        if entry.get("ItemName") and entry.get("ItemName") == food_item.name:
            data[idx] = new_entry
            replaced = True
            break

    if not replaced:
        data.append(new_entry)

    try:
        p.write_text(json.dumps(data, indent=2), encoding="utf-8")
        return True
    except Exception:
        return False


def save_food_items_to_cache(food_items: List[FoodItem], cache_path: str | Path) -> Path:
    """Save a list of `FoodItem` objects to the given cache JSON.

    Merges with existing items (no duplicates). Items are matched by menuItemId or name.
    Returns the Path written.
    """
    p = Path(cache_path)
    existing_data = []
    if p.exists():
        try:
            existing_data = json.loads(p.read_text(encoding="utf-8"))
        except Exception:
            existing_data = []

    # Build a map of existing items by menuItemId and name for deduplication
    existing_by_id = {}
    existing_by_name = {}
    for idx, entry in enumerate(existing_data):
        mid = entry.get("menuItemId") or entry.get("id")
        if mid is not None:
            existing_by_id[str(mid)] = idx
        item_name = entry.get("ItemName")
        if item_name:
            existing_by_name[item_name] = idx

    # Update or append new items
    for food_item in food_items:
        new_entry = _fooditem_to_cache_entry(food_item)
        menu_item_id = getattr(food_item, "menuItemId", None)

        replaced = False
        # Try to replace by menuItemId first
        if menu_item_id is not None:
            idx = existing_by_id.get(str(menu_item_id))
            if idx is not None:
                existing_data[idx] = new_entry
                replaced = True
        # Try to replace by name if not already replaced
        if not replaced:
            idx = existing_by_name.get(food_item.name)
            if idx is not None:
                existing_data[idx] = new_entry
                replaced = True

        # Append if not found
        if not replaced:
            existing_data.append(new_entry)

    p.write_text(json.dumps(existing_data, indent=2), encoding="utf-8")
    return p


# ============================================================================
# Database/Cache Integration
# ============================================================================

def pull_ratings_into_cache(cache_path: str | Path) -> bool:
    """Fetch ratings from DynamoDB and merge them into the cache JSON file.

    Returns True on success.
    """
    p = Path(cache_path)
    if not p.exists():
        return False
    try:
        data = json.loads(p.read_text(encoding="utf-8"))
    except Exception:
        return False

    # collect ids
    ids = []
    for entry in data:
        mid = entry.get("menuItemId") or entry.get("id") or entry.get("ItemName")
        if mid is not None:
            ids.append(str(mid))

    if not ids:
        return False

    ratings = database_api.fetch_ratings_for_items(ids)

    for entry in data:
        mid = entry.get("menuItemId") or entry.get("id") or entry.get("ItemName")
        if mid is None:
            continue
        r = ratings.get(str(mid)) or {}
        entry["ratingOverall"] = float(r.get("ratingOverall") or 0.0)
        entry["ratingToday"] = float(r.get("ratingToday") or 0.0)
        entry["ratingCount"] = int(r.get("ratingCount") or 0)

    try:
        p.write_text(json.dumps(data, indent=2), encoding="utf-8")
        return True
    except Exception:
        return False


def update_database_from_cache(cache_path: str | Path) -> bool:
    """Upload current cache into DynamoDB (delegates to `database_api.upload_cache_json`)."""
    return database_api.upload_cache_json(str(cache_path))


__all__ = [
    # Date/Time
    "get_current_date_str",
    "get_date_from_cache_filename",
    "read_cache_date",
    "set_cache_date",
    # API
    "poll_api_to_raw",
    # Parsing
    "parse_raw_to_objects",
    # Cache operations
    "write_cache_from_fooditems",
    "get_food_items_from_cache",
    "find_cache_file_for_date",
    "get_food_item_from_cache",
    "save_food_item_to_cache",
    "save_food_items_to_cache",
    # Database integration
    "pull_ratings_into_cache",
    "update_database_from_cache",
]