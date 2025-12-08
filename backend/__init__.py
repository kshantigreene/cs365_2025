"""RateMyMeal backend package.

Core modules:
- helper_functions: All cache, API, and database operations
- models: Data classes (FoodItem, Review)
- APIs: External API integrations (Thomas menu, DynamoDB)
"""

from backend.helper_functions import (
    # Date/Time utilities
    get_current_date_str,
    get_date_from_cache_filename,
    read_cache_date,
    set_cache_date,
    # API and parsing
    poll_api_to_raw,
    parse_raw_to_objects,
    # Cache operations
    write_cache_from_fooditems,
    get_food_items_from_cache,
    find_cache_file_for_date,
    get_food_item_from_cache,
    save_food_item_to_cache,
    save_food_items_to_cache,
    # Database integration
    pull_ratings_into_cache,
    update_database_from_cache,
)

from backend.models import FoodItem, Review

__all__ = [
    # Functions
    "get_current_date_str",
    "get_date_from_cache_filename",
    "read_cache_date",
    "set_cache_date",
    "poll_api_to_raw",
    "parse_raw_to_objects",
    "write_cache_from_fooditems",
    "get_food_items_from_cache",
    "find_cache_file_for_date",
    "get_food_item_from_cache",
    "save_food_item_to_cache",
    "save_food_items_to_cache",
    "pull_ratings_into_cache",
    "update_database_from_cache",
    # Classes
    "FoodItem",
    "Review",
]




