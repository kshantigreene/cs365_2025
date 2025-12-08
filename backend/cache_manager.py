"""
Backward compatibility wrapper for cache_manager module.
All functionality has been consolidated into helper_functions.py.

Import from helper_functions instead:
    from backend.helper_functions import poll_api_to_raw, parse_raw_to_objects, etc.
"""

from backend.helper_functions import (
    poll_api_to_raw,
    parse_raw_to_objects,
    write_cache_from_fooditems,
    get_food_items_from_cache,
    save_food_items_to_cache,
    get_food_item_from_cache,
    save_food_item_to_cache,
    pull_ratings_into_cache,
    update_database_from_cache,
    find_cache_file_for_date,
)

__all__ = [
    "poll_api_to_raw",
    "parse_raw_to_objects",
    "write_cache_from_fooditems",
    "get_food_items_from_cache",
    "save_food_items_to_cache",
    "get_food_item_from_cache",
    "save_food_item_to_cache",
    "pull_ratings_into_cache",
    "update_database_from_cache",
    "find_cache_file_for_date",
]
