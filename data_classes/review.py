from fooditem import FoodItem

class Review:
    __userId: int
    __foodItem: FoodItem
    __comment: str
    __rating: float
    __date: str

    def __init__(self, userId: str, foodItem: FoodItem, rating: float, comment: str, date: str):
        self.__userId = userId
        self.__foodItem = foodItem
        self.__rating = rating
        self.__comment = comment
        self.__date = date

    def getUserId(self) -> int:
        return self.__userId
    
    def getFoodItem(self) -> FoodItem:
        return self.__foodItem
    
    def getComment(self) -> str:
        return self.__comment
    
    def getRating(self) -> float:
        return self.__rating
    
    def getDate(self) -> str:
        return self.__date
    
    def setComment(self, comment: str) -> None:
        self.__comment = comment

    def setRating(self, rating: float) -> None:
        self.__rating = rating

    def setDate(self, date: str) -> None:
        self.__date = date

    def setFoodItem(self, foodItem: FoodItem) -> None:
        self.__foodItem = foodItem

    def setUserId(self, userId: int) -> None:
        self.__userId = userId