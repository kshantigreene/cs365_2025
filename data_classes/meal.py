from fooditem import FoodItem

class Meal:
    __name: str
    __foodItems = list[FoodItem]
    __dailyRating: float
    __overallRating: float

    def __init__(self, name: str):
        self.__name = name
        self.__foodItems = []

    def getName(self) -> str:
        return self.__name
    
    def getFoodItems(self) -> list[FoodItem]:
        return self.__foodItems
    
    def setName(self, name: str) -> None:
        self.__name = name

    def setFoodItems(self, foodItems: list[FoodItem]) -> None:
        self.__foodItems = foodItems

    def addFoodItem(self, foodItem: FoodItem) -> None:
        self.__foodItems.append(foodItem)

    def removeFoodItem(self, foodItem: FoodItem) -> None:
        self.__foodItems.remove(foodItem)

    def clearFoodItems(self) -> None:
        self.__foodItems.clear()
    
    def calculateOverallRating(self) -> None:
        if not self.__foodItems:
            self.__overallRating = 0.0
            return
        total_rating = sum(foodItem.getOverallRating() for foodItem in self.__foodItems)
        self.__overallRating = total_rating / len(self.__foodItems)

    def calculateDailyRating(self, date: str) -> None:
        if not self.__foodItems:
            self.__dailyRating = 0.0
            return
        total_rating = sum(foodItem.getDailyRating() for foodItem in self.__foodItems)
        self.__dailyRating = total_rating / len(self.__foodItems)