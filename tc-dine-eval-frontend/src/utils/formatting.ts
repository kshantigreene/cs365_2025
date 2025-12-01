import type { MealType } from "../types/foodItem";

const MEAL_LABELS: Record<MealType, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  AFTERNOON_SNACK: "Afternoon Snack",
  DINNER: "Dinner"
};

export function formatMealType(type: MealType): string {
  return MEAL_LABELS[type] ?? type;
}

export function formatRating(value: number | undefined, fallback = "—"): string {
  if (value === undefined || Number.isNaN(value)) {
    return fallback;
  }
  return value.toFixed(1);
}

export function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) {
    return `${count} ${singular}`;
  }
  return `${count} ${plural ?? `${singular}s`}`;
}



