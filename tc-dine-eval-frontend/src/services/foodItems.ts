import type { FoodItem } from "../types/foodItem";
import type { Meal } from "../types/meal";

export function flattenFoodItems(meals: Meal[] | undefined): FoodItem[] {
  if (!meals) {
    return [];
  }
  return meals.flatMap((meal) => meal.groups.flatMap((group) => group.items));
}

export function findFoodItemById(
  meals: Meal[] | undefined,
  foodItemId: string | undefined
): { item?: FoodItem; meal?: Meal } {
  if (!meals || !foodItemId) {
    return {};
  }

  for (const meal of meals) {
    for (const group of meal.groups) {
      const match = group.items.find((item) => item.id === foodItemId);
      if (match) {
        return { item: match, meal };
      }
    }
  }

  return {};
}



