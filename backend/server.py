from __future__ import annotations

import json
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional
from uuid import uuid4

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator

from backend.APIs.thomas_menu import ThomasMenu
from backend.data_classes.fooditem import FoodItem
from backend.utils import slugify

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MENU_CACHE_PATH = Path("thomas_menu.json")
SAMPLE_MENU_PATH = Path("backend/sample_menu.json")
REVIEWS_PATH = Path("reviews.json")


class ReviewModel(BaseModel):
    id: str
    foodItemId: str = Field(..., alias="foodItemId")
    rating: int
    comment: str
    date: str


class ReviewCreate(BaseModel):
    foodItemId: str
    rating: int = Field(..., ge=1, le=5)
    comment: str

    @validator("comment")
    def validate_comment(cls, value: str) -> str:
        if len(value.strip()) < 4:
            raise ValueError("Comment must have at least 4 characters.")
        return value.strip()


class ReviewStore:
    def __init__(self, path: Path):
        self.path = path
        self._reviews: list[ReviewModel] = []
        self._load()

    def _load(self) -> None:
        if self.path.exists():
            data = json.loads(self.path.read_text(encoding="utf-8"))
            self._reviews = [ReviewModel(**record) for record in data]

    def _persist(self) -> None:
        serializable = [review.dict(by_alias=True) for review in self._reviews]
        self.path.write_text(json.dumps(serializable, indent=2), encoding="utf-8")

    def list_for_item(self, food_item_id: str) -> list[ReviewModel]:
        return sorted(
            (review for review in self._reviews if review.foodItemId == food_item_id),
            key=lambda item: item.date,
            reverse=True
        )

    def add_review(self, payload: ReviewCreate) -> ReviewModel:
        review = ReviewModel(
            id=str(uuid4()),
            foodItemId=payload.foodItemId,
            rating=payload.rating,
            comment=payload.comment.strip(),
            date=datetime.now(timezone.utc).isoformat()
        )
        self._reviews.append(review)
        self._persist()
        return review

    def stats_for_item(self, food_item_id: str) -> dict[str, Any]:
        reviews = self.list_for_item(food_item_id)
        if not reviews:
            return {"count": 0, "overall": 0.0, "today": 0.0}

        overall = sum(review.rating for review in reviews) / len(reviews)
        today_str = datetime.now(timezone.utc).date().isoformat()
        today_reviews = [r.rating for r in reviews if r.date.startswith(today_str)]
        today = sum(today_reviews) / len(today_reviews) if today_reviews else 0.0
        return {"count": len(reviews), "overall": overall, "today": today}


class MenuRepository:
    def __init__(self, cache_path: Path):
        self.service = ThomasMenu(cache_path=cache_path)
        self._records: Optional[list[dict[str, Any]]] = None

    def _map_food_items(self, food_items: list[FoodItem]):
        output = []
        for food_item in food_items:
            name = food_item.name.strip() or food_item.description.strip() or "Unnamed Item"
            output.append(
                {
                    "ItemName": name,
                    "Meal": food_item.meal.replace(" ", "_").upper(),
                    "Group": food_item.group,
                    "Meta": food_item.to_json()
                }
            )
        return output

    def _apply_review_stats(
        self, records: list[dict[str, Any]], review_store: ReviewStore
    ) -> list[dict[str, Any]]:
        result = []
        for record in records:
            stats = review_store.stats_for_item(slugify(record["ItemName"]))
            meta = {
                **record["Meta"],
                "ratingOverall": stats["overall"],
                "ratingToday": stats["today"],
                "ratingCount": stats["count"]
            }
            result.append({**record, "Meta": meta})
        return result

    def _load_sample_records(self) -> list[dict[str, Any]]:
        if not SAMPLE_MENU_PATH.exists():
            raise FileNotFoundError(
                f"Sample menu file not found at {SAMPLE_MENU_PATH.resolve()}"
            )
        logger.warning("Falling back to sample menu data.")
        return json.loads(SAMPLE_MENU_PATH.read_text(encoding="utf-8"))

    def get_records(self, review_store: ReviewStore) -> list[dict[str, Any]]:
        if self._records is None:
            try:
                food_items = self.service.parse_food_items()
                base_records = self._map_food_items(food_items)
            except Exception as exc:
                logger.error("Failed to load live menu: %s", exc)
                base_records = self._load_sample_records()
            self._records = self._apply_review_stats(base_records, review_store)
        return self._records

    def refresh(self, review_store: ReviewStore) -> list[dict[str, Any]]:
        try:
            self.service.refresh_menu()
            self._records = None
        except Exception as exc:
            logger.error("Failed to refresh menu: %s", exc)
        return self.get_records(review_store)


app = FastAPI(title="TC Dine Eval API", version="0.1.0")
review_store = ReviewStore(REVIEWS_PATH)
menu_repository = MenuRepository(MENU_CACHE_PATH)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/menu")
def get_menu():
    return menu_repository.get_records(review_store)


@app.post("/menu/refresh")
def refresh_menu():
    return menu_repository.refresh(review_store)


@app.get("/reviews")
def list_reviews(foodItemId: str = Query(..., alias="foodItemId")):
    reviews = review_store.list_for_item(foodItemId)
    return [review.dict(by_alias=True) for review in reviews]


@app.post("/reviews", status_code=201)
def create_review(payload: ReviewCreate):
    records = menu_repository.get_records(review_store)
    valid_ids = {slugify(record["ItemName"]) for record in records}
    if payload.foodItemId not in valid_ids:
        raise HTTPException(status_code=404, detail="Food item not found.")
    review = review_store.add_review(payload)
    menu_repository._records = None  # trigger recalculation of ratings
    return review.dict(by_alias=True)


