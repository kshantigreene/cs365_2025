type Props = {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md";
};

const stars = [1, 2, 3, 4, 5];

export default function StarRating({
  value,
  onChange,
  readOnly = false,
  size = "md"
}: Props) {
  const handleClick = (star: number) => {
    if (readOnly || !onChange) {
      return;
    }
    onChange(star);
  };

  return (
    <div className={`star-rating ${size}`} aria-label={`Rating: ${value} out of 5`}>
      {stars.map((star) => {
        const state = getStarState(value, star);
        return (
          <button
            key={star}
            type="button"
            className={`star ${state}`}
            onClick={() => handleClick(star)}
            aria-label={`Set rating to ${star}`}
            disabled={readOnly}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

function getStarState(value: number, star: number): "full" | "half" | "empty" {
  if (value >= star - 0.2) {
    return "full";
  }
  if (value >= star - 0.7) {
    return "half";
  }
  return "empty";
}



