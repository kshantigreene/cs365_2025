from review import Review

class FoodItem:
    __name: str
    __calories: int
    __dailyRating: float
    __overallRating: float
    __reviews: list[Review]

    def __init__(self, name: str, calories: int):
        self.__name = name
        self.__calories = calories

    def getname(self) -> str:
        return self.__name
    
    def getCalories(self) -> int:
        return self.__calories
    
    def getDailyRating(self) -> float:
        return self.__dailyRating
    
    def getOverallRating(self) -> float:
        return self.__overallRating
    
    def getReviews(self) -> list[Review]:
        return self.__reviews
    
    def setname(self, name: str) -> None:
        self.__name = name

    def setCalories(self, calories: int) -> None:
        self.__calories = calories

    def setDailyRating(self, dailyRating: float) -> None:
        self.__dailyRating = dailyRating

    def setOverallRating(self, overallRating: float) -> None:
        self.__overallRating = overallRating

    def setReviews(self, reviews: list[Review]) -> None:
        self.__reviews = reviews

    def addReview(self, review: Review) -> None:
        self.__reviews.append(review)

    def removeReview(self, review: Review) -> None:
        self.__reviews.remove(review)

    def clearReviews(self) -> None:
        self.__reviews.clear()

    def calculateOverallRating(self) -> None:
        if not self.__reviews:
            self.__overallRating = 0.0
            return
        total_rating = sum(review.getRating() for review in self.__reviews)
        self.__overallRating = total_rating / len(self.__reviews)

    def calculateDailyRating(self, date: str) -> None:
        daily_reviews = [review for review in self.__reviews if review.getDate() == date]
        if not daily_reviews:
            self.__dailyRating = 0.0
            return
        total_rating = sum(review.getRating() for review in daily_reviews)
        self.__dailyRating = total_rating / len(daily_reviews)