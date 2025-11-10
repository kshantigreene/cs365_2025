from __future__ import annotations

class FoodItem:
    def __init__(
        self,
        meal: str,
        group: str,
        name: str,
        description: str,
        ingredients: list[str],
        allergens: list[str],
        calories: int,
        caloriesFromFat: int,
        fat: str,
        saturatedFat: str,
        transFat: str,
        polyunsaturatedFat: str,
        cholesterol: str,
        sodium: str,
        carbohydrates: str,
        dietaryFiber: str,
        sugar: str,
        protein: str,
        potassium: str,
        iron: str,
        calcium: str,
        vitaminA: str,
        vitaminC: str,
        vitaminD: str,
        portionSize: str,
        portion: str,
        isVegan: bool,
        isVegetarian: bool,
        isMindful: bool,
        isSwell: bool,
        isPlantBased: bool
    ):
        self.meal = meal
        self.group = group
        self.name = name
        self.description = description
        self.ingredients = ingredients
        self.allergens = allergens
        self.calories = calories
        self.caloriesFromFat = caloriesFromFat
        self.fat = fat
        self.saturatedFat = saturatedFat
        self.transFat = transFat
        self.polyunsaturatedFat = polyunsaturatedFat
        self.cholesterol = cholesterol
        self.sodium = sodium
        self.carbohydrates = carbohydrates
        self.dietaryFiber = dietaryFiber
        self.sugar = sugar
        self.protein = protein
        self.potassium = potassium
        self.iron = iron
        self.calcium = calcium
        self.vitaminA = vitaminA
        self.vitaminC = vitaminC
        self.vitaminD = vitaminD
        self.portionSize = portionSize
        self.portion = portion
        self.isVegan = isVegan
        self.isVegetarian = isVegetarian
        self.isMindful = isMindful
        self.isSwell = isSwell
        self.isPlantBased = isPlantBased
        self.reviews = []
        self.overallRating = 0.0
        self.todayRating = 0.0
