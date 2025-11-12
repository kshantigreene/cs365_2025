import uuid

class Review:

    def __init__(self, rating: int, comment: str, date: str) -> None:
        self.id = uuid.uuid4()
        self.rating = rating
        self.comment = comment
        self.date = date
    
    def __str__(self) -> str:
        return f"Rating: {self.rating}, Date: {self.date}, Comment: {self.comment}"
    
    def set_rating(self, rating: int) -> None:
        self.rating = rating

    def set_comment(self, comment: str) -> None:
        self.comment = comment

    def set_date(self, date: str) -> None:
        self.date = date