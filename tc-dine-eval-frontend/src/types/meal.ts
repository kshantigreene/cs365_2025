import type { FoodItem } from "./foodItem";
import type { MealName } from "./foodItem";

export interface Meal {
  name: MealName;
  foodItems: FoodItem[];
  mealRating: number;
}
