import { formatRating } from "../utils/formatting";

type Props = {
  label: string;
  value: number;
  size?: "sm" | "md";
};

export default function RatingBadge({ label, value, size = "md" }: Props) {
  const tone = getTone(value);
  return (
    <div className={`rating-badge ${tone} ${size}`}>
      <span className="rating-value">{formatRating(value)}</span>
      <span className="rating-label">{label}</span>
    </div>
  );
}

function getTone(value: number): "positive" | "warning" | "negative" {
  if (value >= 4.3) return "positive";
  if (value >= 3.5) return "warning";
  return "negative";
}



