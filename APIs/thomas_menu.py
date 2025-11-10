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

    def parse_food_items(self) -> list[FoodItem]: # Relies on JSON being made
        with open("thomas_menu.json", "r", encoding="utf-8") as f:
            data = json.load(f)

        food_items = []

        for meal in data:
            meal_name = meal["name"]

            for group in meal["groups"]:
                group_name = group["name"]

                for item in group["items"]:
                    food_items.append(
                        FoodItem(
                            meal=meal_name,
                            group=group_name,
                            name=item.get("formalName", ""),
                            description=item.get("description", ""),
                            ingredients=item.get("ingredients", "").split("; "),
                            allergens=[a["name"] for a in item.get("allergens", [])],
                            calories=int(item.get("calories", "0") or 0),
                            caloriesFromFat=int(item.get("caloriesFromFat", "0") or 0),
                            fat=item.get("fat", ""),
                            saturatedFat=item.get("saturatedFat", ""),
                            transFat=item.get("transFat", ""),
                            polyunsaturatedFat=item.get("polyunsaturatedFat", ""),
                            cholesterol=item.get("cholesterol", ""),
                            sodium=item.get("sodium", ""),
                            carbohydrates=item.get("carbohydrates", ""),
                            dietaryFiber=item.get("dietaryFiber", ""),
                            sugar=item.get("sugar", ""),
                            protein=item.get("protein", ""),
                            potassium=item.get("potassium", ""),
                            iron=item.get("iron", ""),
                            calcium=item.get("calcium", ""),
                            vitaminA=item.get("vitaminA", ""),
                            vitaminC=item.get("vitaminC", ""),
                            vitaminD=item.get("vitaminD", ""),
                            portionSize=item.get("portionSize", ""),
                            portion=item.get("portion", ""),
                            isVegan=item.get("isVegan", False),
                            isVegetarian=item.get("isVegetarian", False),
                            isMindful=item.get("isMindful", False),
                            isSwell=item.get("isSwell", False),
                            isPlantBased=item.get("isPlantBased", False)
                        )
                    )

        return food_items
