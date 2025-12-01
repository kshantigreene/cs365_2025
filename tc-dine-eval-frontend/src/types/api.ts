import type { MealType } from "./foodItem";

export interface BackendAllergen {
  name: string;
}

export interface BackendFoodMeta {
  formalName?: string;
  description?: string;
  ingredients?: string;
  allergens?: BackendAllergen[];

  calories?: number;
  caloriesFromFat?: number;
  fat?: string;
  saturatedFat?: string;
  transFat?: string;
  polyunsaturatedFat?: string;
  cholesterol?: string;
  sodium?: string;
  carbohydrates?: string;
  dietaryFiber?: string;
  sugar?: string;
  protein?: string;
  potassium?: string;
  iron?: string;
  calcium?: string;
  vitaminA?: string;
  vitaminC?: string;
  vitaminD?: string;

  portionSize?: string;
  portion?: string;

  isVegan?: boolean;
  isVegetarian?: boolean;
  isMindful?: boolean;
  isSwell?: boolean;
  isPlantBased?: boolean;

  ratingOverall?: number;
  ratingToday?: number;
  ratingCount?: number;
}

export interface BackendMenuRecord {
  ItemName: string;
  Meal: MealType;
  Group: string;
  Meta: BackendFoodMeta;
}



