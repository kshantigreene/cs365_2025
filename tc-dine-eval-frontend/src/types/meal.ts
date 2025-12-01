import type { FoodItem, MealType } from "./foodItem";

export interface FoodGroup {
  name: string;
  items: FoodItem[];
}

export interface Meal {
  type: MealType;
  name: string;
  timeRange: string;
  ratingToday: number;
  ratingOverall: number;
  groups: FoodGroup[];
}



