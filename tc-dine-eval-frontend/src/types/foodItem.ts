import type { Review } from "./review";

export type MealName = "BREAKFAST" | "LUNCH" | "AFTERNOON_SNACK" | "DINNER";

export interface FoodItem {
  id: string;
  name: string;
  meal: MealName;
  reviews?: Review[];
  activeRating: number;
  overallRating: number;
}
