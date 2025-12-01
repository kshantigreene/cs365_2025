import type { Review } from "../types/review";
import { formatDate } from "../utils/formatting";
import StarRating from "./StarRating";

type Props = {
  reviews: Review[];
};

export default function ReviewList({ reviews }: Props) {
  if (reviews.length === 0) {
    return <p className="muted">No reviews yet. Be the first to leave feedback!</p>;
  }

  return (
    <ul className="review-list">
      {reviews.map((review) => (
        <li key={review.id} className="review-card">
          <div className="review-meta">
            <StarRating value={review.rating} readOnly size="sm" />
            <span className="muted">{formatDate(review.date)}</span>
          </div>
          <p>{review.comment}</p>
        </li>
      ))}
    </ul>
  );
}



