from data_classes.fooditem import FoodItem
import json
import requests
from helper_functions import get_current_date_str

class ThomasMenu:

    BASE_URL = "https://api-prd.sodexomyway.net/v0.2/data/menu/94311001/14863"
    HEADERS = {
        "api-key": "68717828-b754-420d-9488-4c37cb7d7ef7",
        "Accept": "application/json"
    }

    def __init__(self):
        self.__menu = self.get_menu(get_current_date_str())

    def get_menu(self, date: str): # date format: 'YYYY-MM-DD'
        params = {"date": date}
        response = requests.get(self.BASE_URL, headers=self.HEADERS, params=params)
        return response.json()
    
    def save_json(self, file_path: str):
        with open(file_path, 'w') as f:
            import json
            json.dump(self.__menu, f, indent=4)

    def parse_food_items(self) -> list[FoodItem]:
        if not self.__menu:
            self.__menu = self.get_menu(get_current_date_str())

        with open("thomas_menu.json", "r", encoding="utf-8") as f:
            data = json.load(f)

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

        with open("thomas_menu.json", "r", encoding="utf-8") as f:
            data = json.load(f)

        # Create a lookup: name -> FoodItem
        lookup = {f.name: f for f in food_items}

        # Rebuild the JSON
        new_data = []

        for meal in data:
            new_meal = {
                "name": meal["name"],
                "groups": []
            }

            for group in meal["groups"]:
                new_group = {
                    "name": group["name"],
                    "items": []
                }

                for item in group["items"]:
                    name = item.get("formalName", "")

                    if name in lookup:
                        # Replace item with enriched version
                        new_group["items"].append(lookup[name].to_json())
                    else:
                        # fallback: keep original
                        new_group["items"].append(item)

                new_meal["groups"].append(new_group)

            new_data.append(new_meal)

        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(new_data, f, indent=4)