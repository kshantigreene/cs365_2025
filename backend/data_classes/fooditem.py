from data_classes.review import Review
from dataclasses import dataclass, field

@dataclass
class FoodItem:
    meal: str
    group: str
    name: str
    description: str
    ingredients: list[str] = field(default_factory=list)
    allergens: list[str] = field(default_factory=list)

    calories: int = 0
    caloriesFromFat: int = 0

    fat: str = ""
    saturatedFat: str = ""
    transFat: str = ""
    polyunsaturatedFat: str = ""
    cholesterol: str = ""
    sodium: str = ""
    carbohydrates: str = ""
    dietaryFiber: str = ""
    sugar: str = ""
    protein: str = ""
    potassium: str = ""
    iron: str = ""
    calcium: str = ""
    vitaminA: str = ""
    vitaminC: str = ""
    vitaminD: str = ""

    portionSize: str = ""
    portion: str = ""

    isVegan: bool = False
    isVegetarian: bool = False
    isMindful: bool = False
    isSwell: bool = False
    isPlantBased: bool = False

    reviews: list[Review] = field(default_factory=list)
    overallRating: float = 0.0
    todayRating: float = 0.0

    def addReview(self, review: Review, today: str | None = None) -> None:
        self.reviews.append(review)
        self.calculateOverallRating()
        if today:
            self.calculateTodayRating(today)

    def clearReviews(self) -> None:
        self.reviews.clear()
        self.overallRating = 0.0
        self.todayRating = 0.0

    def calculateOverallRating(self) -> None:
        if not self.reviews:
            self.overallRating = 0.0
            return
        ratings = [r.rating for r in self.reviews]
        self.overallRating = sum(ratings) / len(ratings)

    def calculateTodayRating(self, today: str) -> None:
        today_reviews = [r.rating for r in self.reviews if r.date == today]
        self.todayRating = (sum(today_reviews) / len(today_reviews)) if today_reviews else 0.0

    def __str__(self) -> str:
        info = [
            f"Meal: {self.meal}",
            f"Group: {self.group}",
            f"Name: {self.name}",
            f"Description: {self.description}",
            f"Ingredients: {', '.join(self.ingredients) if self.ingredients else 'None'}",
            f"Allergens: {', '.join(self.allergens) if self.allergens else 'None'}",
            "",
            f"Calories: {self.calories} (from fat: {self.caloriesFromFat})",
            f"Fat: {self.fat}",
            f"Saturated Fat: {self.saturatedFat}",
            f"Trans Fat: {self.transFat}",
            f"Polyunsaturated Fat: {self.polyunsaturatedFat}",
            f"Cholesterol: {self.cholesterol}",
            f"Sodium: {self.sodium}",
            f"Carbohydrates: {self.carbohydrates}",
            f"Dietary Fiber: {self.dietaryFiber}",
            f"Sugar: {self.sugar}",
            f"Protein: {self.protein}",
            f"Potassium: {self.potassium}",
            f"Iron: {self.iron}",
            f"Calcium: {self.calcium}",
            f"Vitamin A: {self.vitaminA}",
            f"Vitamin C: {self.vitaminC}",
            f"Vitamin D: {self.vitaminD}",
            "",
            f"Portion Size: {self.portionSize}",
            f"Portion: {self.portion}",
            "",
            f"Vegan: {self.isVegan}",
            f"Vegetarian: {self.isVegetarian}",
            f"Mindful: {self.isMindful}",
            f"Swell: {self.isSwell}",
            f"Plant-Based: {self.isPlantBased}",
            "",
            f"Overall Rating: {self.overallRating:.2f}",
            f"Today's Rating: {self.todayRating:.2f}",
            f"Number of Reviews: {len(self.reviews)}"
        ]
        return "\n".join(info)
    
    def to_json(self) -> dict:
        return {
            "formalName": self.name,
            "description": self.description,
            "ingredients": "; ".join(self.ingredients),
            "allergens": [{"name": a} for a in self.allergens],

            "calories": self.calories,
            "caloriesFromFat": self.caloriesFromFat,

            "fat": self.fat,
            "saturatedFat": self.saturatedFat,
            "transFat": self.transFat,
            "polyunsaturatedFat": self.polyunsaturatedFat,
            "cholesterol": self.cholesterol,
            "sodium": self.sodium,
            "carbohydrates": self.carbohydrates,
            "dietaryFiber": self.dietaryFiber,
            "sugar": self.sugar,
            "protein": self.protein,
            "potassium": self.potassium,
            "iron": self.iron,
            "calcium": self.calcium,
            "vitaminA": self.vitaminA,
            "vitaminC": self.vitaminC,
            "vitaminD": self.vitaminD,

            "portionSize": self.portionSize,
            "portion": self.portion,

            "isVegan": self.isVegan,
            "isVegetarian": self.isVegetarian,
            "isMindful": self.isMindful,
            "isSwell": self.isSwell,
            "isPlantBased": self.isPlantBased,

            "ratingOverall": self.overallRating,
            "ratingToday": self.todayRating,
            "ratingCount": len(self.reviews)
        }

