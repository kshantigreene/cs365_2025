import { Link } from "react-router-dom";
import type { FoodItem } from "../types/foodItem";
import RatingBadge from "./RatingBadge";
import { formatMealType } from "../utils/formatting";

type Props = {
  item: FoodItem;
};

export default function FoodItemCard({ item }: Props) {
  return (
    <Link to={`/food-item/${item.id}`} className="card food-card">
      <div className="card-header">
        <p className="eyebrow">{formatMealType(item.mealType)}</p>
        <h3>{item.name}</h3>
        <p className="muted">{item.description || "No description provided."}</p>
      </div>
      <div className="card-body rating-row">
        <RatingBadge label="Today" value={item.todayRating} size="sm" />
        <RatingBadge label="Overall" value={item.overallRating} size="sm" />
      </div>
      <p className="card-cta">See details →</p>
    </Link>
  );
}



