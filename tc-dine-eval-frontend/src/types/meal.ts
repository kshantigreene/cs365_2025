<<<<<<< HEAD
import type { FoodItem } from "./foodItem";
import type { MealName } from "./foodItem";

export interface Meal {
  name: MealName;
  foodItems: FoodItem[];
  mealRating: number;
}
=======
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



>>>>>>> d28bd9aea6d516f218774cdf28f516c9fca1d6cb
