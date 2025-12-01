import type { Review } from "./review";

export type MealType = "BREAKFAST" | "LUNCH" | "AFTERNOON_SNACK" | "DINNER";

export interface FoodItem {
  id: string;
  mealType: MealType;
  group: string;
  name: string;
  description: string;
  ingredients: string[];
  allergens: string[];

  calories: number;
  caloriesFromFat: number;
  fat: string;
  saturatedFat: string;
  transFat: string;
  polyunsaturatedFat: string;
  cholesterol: string;
  sodium: string;
  carbohydrates: string;
  dietaryFiber: string;
  sugar: string;
  protein: string;
  potassium: string;
  iron: string;
  calcium: string;
  vitaminA: string;
  vitaminC: string;
  vitaminD: string;

  portionSize: string;
  portion: string;

  isVegan: boolean;
  isVegetarian: boolean;
  isMindful: boolean;
  isSwell: boolean;
  isPlantBased: boolean;

  ratingCount: number;
  overallRating: number;
  todayRating: number;

  reviews?: Review[];
}



