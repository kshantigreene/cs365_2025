from __future__ import annotations
from dataclasses import dataclass, field
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from review import Review  # avoids circular import at runtime

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

    reviews: list["Review"] = field(default_factory=list)
    overallRating: float = 0.0
    todayRating: float = 0.0

    def addReview(self, review: "Review", today: str | None = None) -> None:
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