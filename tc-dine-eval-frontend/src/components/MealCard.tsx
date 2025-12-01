import { Link } from "react-router-dom";
import type { Meal } from "../types/meal";
import { formatRating } from "../utils/formatting";

type Props = {
  meal: Meal;
};

export default function MealCard({ meal }: Props) {
  const itemCount = meal.groups.reduce((total, group) => total + group.items.length, 0);

  return (
    <Link to={`/meal/${meal.type}`} className="card meal-card">
      <div className="card-header">
        <p className="eyebrow">{meal.timeRange}</p>
        <h3>{meal.name}</h3>
      </div>
      <div className="card-body">
        <div>
          <p className="label">Today&apos;s rating</p>
          <p className="stat">{formatRating(meal.ratingToday)}</p>
        </div>
        <div>
          <p className="label">Overall rating</p>
          <p className="stat">{formatRating(meal.ratingOverall)}</p>
        </div>
        <div>
          <p className="label">Items</p>
          <p className="stat">{itemCount}</p>
        </div>
      </div>
      <p className="card-cta">View meal →</p>
    </Link>
  );
}



