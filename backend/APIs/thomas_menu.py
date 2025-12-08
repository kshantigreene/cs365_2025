from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Optional, Union

import requests

from backend.models import FoodItem
from backend.helper_functions import get_current_date_str
import logging

LOG = logging.getLogger(__name__)

class ThomasMenu:

    BASE_URL = "https://api-prd.sodexomyway.net/v0.2/data/menu/94311001/14863"
    HEADERS = {
        "api-key": "68717828-b754-420d-9488-4c37cb7d7ef7",
        "Accept": "application/json"
    }

    def __init__(self, cache_path: Union[str, Path] = "thomas_menu.json"):
        self._cache_path = Path(cache_path)
        self.__menu: Optional[list[dict[str, Any]]] = None
        if self._cache_path.exists():
            self.__menu = json.loads(self._cache_path.read_text(encoding="utf-8"))
        else:
            self.refresh_menu()

    def get_menu(self, date: str): # date format: 'YYYY-MM-DD'
        params = {"date": date}
        LOG.debug("Requesting Thomas menu from %s for date=%s", self.BASE_URL, date)
        response = requests.get(self.BASE_URL, headers=self.HEADERS, params=params)
        LOG.debug("Thomas menu response status=%s", getattr(response, 'status_code', None))
        try:
            payload = response.json()
            LOG.debug("Thomas menu JSON length=%d", len(json.dumps(payload)))
            return payload
        except Exception:
            LOG.exception("Failed to parse Thomas menu JSON response")
            return {}
    
    def refresh_menu(self) -> None:
        LOG.debug("Refreshing Thomas menu cache for today")
        self.__menu = self.get_menu(get_current_date_str())
        if self.__menu:
            LOG.debug("Writing ThomasMenu cache to %s", self._cache_path)
            self._cache_path.write_text(json.dumps(self.__menu, indent=2), encoding="utf-8")

    def save_json(self, file_path: str):
        if self.__menu is None:
            self.refresh_menu()
        Path(file_path).write_text(json.dumps(self.__menu, indent=2), encoding="utf-8")

    def parse_food_items(self) -> list[FoodItem]:
        if self.__menu is None:
            self.refresh_menu()
        data = self.__menu
        food_items = []

        LOG.debug("Beginning parsing of menu structure: meals=%d", len(data) if isinstance(data, list) else 0)
        for meal_idx, meal in enumerate(data):
            meal_name = meal.get("name", "")
            LOG.debug("Processing meal %d: %s", meal_idx, meal_name)

            for group_idx, group in enumerate(meal.get("groups", [])):
                group_name = group.get("name", "")
                LOG.debug(" Processing group %d: %s", group_idx, group_name)

                for item_idx, item in enumerate(group.get("items", [])):
                    LOG.debug("  Processing item %d in group %s", item_idx, group_name)

                    # Safe helper for nutrients (string fields)
                    def safe_str(key: str) -> str:
                        val = item.get(key)
                        return str(val or "").strip()

                    # Safe helper for booleans
                    def safe_bool(key: str) -> bool:
                        return bool(item.get(key))  # None → False

                    # Safe helper for ints
                    def safe_int(key: str) -> int:
                        val = item.get(key)
                        try:
                            return int(val)
                        except (ValueError, TypeError):
                            return 0

                    # Build FoodItem safely
                    fi = FoodItem(
                        meal=meal_name,
                        group=group_name,
                        name=safe_str("formalName"),
                        description=safe_str("description"),

                        # Ingredients may be null OR empty string
                        ingredients=(item.get("ingredients") or "").split("; "),

                        # Allergens may be null
                        allergens=[a.get("name", "") for a in (item.get("allergens") or [])],

                        calories=safe_int("calories"),
                        caloriesFromFat=safe_int("caloriesFromFat"),

                        fat=safe_str("fat"),
                        saturatedFat=safe_str("saturatedFat"),
                        transFat=safe_str("transFat"),
                        polyunsaturatedFat=safe_str("polyunsaturatedFat"),
                        cholesterol=safe_str("cholesterol"),
                        sodium=safe_str("sodium"),
                        carbohydrates=safe_str("carbohydrates"),
                        dietaryFiber=safe_str("dietaryFiber"),
                        sugar=safe_str("sugar"),
                        protein=safe_str("protein"),
                        potassium=safe_str("potassium"),
                        iron=safe_str("iron"),
                        calcium=safe_str("calcium"),
                        vitaminA=safe_str("vitaminA"),
                        vitaminC=safe_str("vitaminC"),
                        vitaminD=safe_str("vitaminD"),

                        portionSize=safe_str("portionSize"),
                        portion=safe_str("portion"),

                        isVegan=safe_bool("isVegan"),
                        isVegetarian=safe_bool("isVegetarian"),
                        isMindful=safe_bool("isMindful"),
                        isSwell=safe_bool("isSwell"),
                        isPlantBased=safe_bool("isPlantBased"),
                    )
                    # attach the original menuItemId (if present) to the FoodItem instance
                    try:
                        menu_item_id = item.get("menuItemId")
                        if menu_item_id is not None:
                            # normalize to string so downstream code can use it as a key
                            setattr(fi, "menuItemId", str(menu_item_id))
                    except Exception:
                        LOG.debug("Unable to attach menuItemId for item %s", fi.name)
                    LOG.debug("   Created FoodItem: %s (meal=%s group=%s)", fi.name, fi.meal, fi.group)
                    food_items.append(fi)

        LOG.debug("Finished parsing food items; total=%d", len(food_items))
        return food_items


    def save_menu_with_ratings(self, food_items: list[FoodItem], output_path: str):

        # Load the full menu data
        if self.__menu is None:
            self.refresh_menu()
        data = self.__menu

        # Prefer lookup by menuItemId (string) when available, otherwise fall back to name
        lookup_by_id = {getattr(f, 'menuItemId', None): f for f in food_items if getattr(f, 'menuItemId', None) is not None}
        lookup_by_name = {f.name: f for f in food_items}

        output_items = []

        for meal in data:
            meal_name = meal.get("name", "")

            for group in meal.get("groups", []):
                group_name = group.get("name", "")

                for item in group.get("items", []):
                    name = item.get("formalName", "")
                    enriched = item.copy()

                    # Extract menuItemId (if present) and normalize type to string
                    menu_item_id = enriched.pop("menuItemId", None)
                    if menu_item_id is not None:
                        menu_item_id = str(menu_item_id)

                    # Determine rating values using menuItemId first, then fallback to name
                    rating_overall = 0.0
                    rating_today = 0.0
                    rating_count = 0
                    if menu_item_id and menu_item_id in lookup_by_id:
                        food_json = lookup_by_id[menu_item_id].to_json()
                        rating_overall = float(food_json.get("ratingOverall", 0.0))
                        rating_today = float(food_json.get("ratingToday", 0.0))
                        rating_count = int(food_json.get("ratingCount", 0) or 0)
                    elif name in lookup_by_name:
                        food_json = lookup_by_name[name].to_json()
                        rating_overall = float(food_json.get("ratingOverall", 0.0))
                        rating_today = float(food_json.get("ratingToday", 0.0))
                        rating_count = int(food_json.get("ratingCount", 0) or 0)

                    # Clean up enriched Meta so top-level fields aren't repeated
                    enriched.pop("ratingOverall", None)
                    enriched.pop("ratingToday", None)
                    enriched.pop("ratingCount", None)
                    enriched.pop("formalName", None)
                    enriched.pop("meal", None)
                    enriched.pop("groups", None)
                    enriched.pop("name", None)

                    # Move group into Meta only if it is not identical to "course"
                    # (many menus use both; avoid duplication). Keep 'course' if present.
                    if group_name:
                        course_val = enriched.get("course")
                        # Only include 'group' in Meta when it differs from 'course'
                        if not course_val or str(course_val).strip() != str(group_name).strip():
                            enriched["group"] = group_name

                    # Build the requested output structure with ratings and menuItemId as top-level fields
                    output_items.append({
                        "menuItemId": menu_item_id,
                        "ItemName": name,
                        "Meal": meal_name,
                        "ratingOverall": rating_overall,
                        "ratingToday": rating_today,
                        "ratingCount": rating_count,
                        "Meta": enriched
                    })

        # Save final JSON
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(output_items, f, indent=4)
