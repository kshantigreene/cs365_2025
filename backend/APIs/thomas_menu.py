from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Optional, Union

import requests

from backend.data_classes.fooditem import FoodItem
from backend.helper_functions import get_current_date_str

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
        response = requests.get(self.BASE_URL, headers=self.HEADERS, params=params)
        return response.json()
    
    def refresh_menu(self) -> None:
        self.__menu = self.get_menu(get_current_date_str())
        if self.__menu:
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

        for meal in data:
            meal_name = meal.get("name", "")

            for group in meal.get("groups", []):
                group_name = group.get("name", "")

                for item in group.get("items", []):
                    
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
                    food_items.append(
                        FoodItem(
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
                    )

        return food_items


    def save_menu_with_ratings(self, food_items: list[FoodItem], output_path: str):

        # Load the full menu data
        if self.__menu is None:
            self.refresh_menu()
        data = self.__menu

        # Lookup by item name
        lookup = {f.name: f for f in food_items}

        output_items = []

        for meal in data:
            meal_name = meal.get("name", "")

            for group in meal.get("groups", []):
                group_name = group.get("name", "")

                for item in group.get("items", []):
                    name = item.get("formalName", "")

                    enriched = item.copy()

                    # Add rating fields
                    if name in lookup:
                        food_json = lookup[name].to_json()
                        enriched["ratingOverall"] = food_json["ratingOverall"]
                        enriched["ratingToday"] = food_json["ratingToday"]
                        enriched["ratingCount"] = food_json["ratingCount"]
                    else:
                        enriched.setdefault("ratingOverall", 0.0)
                        enriched.setdefault("ratingToday", 0.0)
                        enriched.setdefault("ratingCount", 0)

                    # Build the requested output structure
                    output_items.append({
                        "ItemName": name,
                        "Meal": meal_name,
                        "Group": group_name,
                        "Meta": enriched
                    })

        # Save final JSON
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(output_items, f, indent=4)
