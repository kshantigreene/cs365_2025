import type { BackendMenuRecord } from "../types/api";
import type { FoodItem, MealType } from "../types/foodItem";
import type { Meal } from "../types/meal";
import { api, hasRemoteBackend } from "./api";
import { toFoodItemId } from "../utils/ids";
import { getMealTimeRange } from "../utils/time";
import { formatMealType } from "../utils/formatting";

const MENU_SAMPLE_PATH = "/menu-sample.json";
const MEAL_ORDER: MealType[] = ["BREAKFAST", "LUNCH", "AFTERNOON_SNACK", "DINNER"];

export async function fetchMenuRecords(): Promise<BackendMenuRecord[]> {
  if (hasRemoteBackend) {
    const { data } = await api.get<BackendMenuRecord[]>("/menu");
    return data;
  }

  const response = await fetch(MENU_SAMPLE_PATH);
  if (!response.ok) {
    throw new Error("Unable to load menu data");
  }
  return response.json();
}

function mapRecordToFoodItem(record: BackendMenuRecord): FoodItem {
  const meta = record.Meta ?? {};
  const name = (meta.formalName ?? record.ItemName).trim();
  const ingredients =
    meta.ingredients?.split(";").map((item) => item.trim()).filter(Boolean) ?? [];
  const allergens =
    meta.allergens?.map((item) => item.name).filter(Boolean) ?? [];

  return {
    id: toFoodItemId(name),
    mealType: record.Meal,
    group: record.Group || "Chef's Choice",
    name,
    description: meta.description?.trim() ?? "",
    ingredients,
    allergens,
    calories: meta.calories ?? 0,
    caloriesFromFat: meta.caloriesFromFat ?? 0,
    fat: meta.fat ?? "",
    saturatedFat: meta.saturatedFat ?? "",
    transFat: meta.transFat ?? "",
    polyunsaturatedFat: meta.polyunsaturatedFat ?? "",
    cholesterol: meta.cholesterol ?? "",
    sodium: meta.sodium ?? "",
    carbohydrates: meta.carbohydrates ?? "",
    dietaryFiber: meta.dietaryFiber ?? "",
    sugar: meta.sugar ?? "",
    protein: meta.protein ?? "",
    potassium: meta.potassium ?? "",
    iron: meta.iron ?? "",
    calcium: meta.calcium ?? "",
    vitaminA: meta.vitaminA ?? "",
    vitaminC: meta.vitaminC ?? "",
    vitaminD: meta.vitaminD ?? "",
    portionSize: meta.portionSize ?? "",
    portion: meta.portion ?? "",
    isVegan: Boolean(meta.isVegan),
    isVegetarian: Boolean(meta.isVegetarian),
    isMindful: Boolean(meta.isMindful),
    isSwell: Boolean(meta.isSwell),
    isPlantBased: Boolean(meta.isPlantBased),
    ratingCount: meta.ratingCount ?? 0,
    overallRating: meta.ratingOverall ?? 0,
    todayRating: meta.ratingToday ?? 0
  };
}

export function buildMeals(records: BackendMenuRecord[]): Meal[] {
  const groupedByMeal = new Map<MealType, Map<string, FoodItem[]>>();

  for (const record of records) {
    const foodItem = mapRecordToFoodItem(record);
    if (!groupedByMeal.has(record.Meal)) {
      groupedByMeal.set(record.Meal, new Map());
    }
    const groupMap = groupedByMeal.get(record.Meal)!;
    if (!groupMap.has(record.Group)) {
      groupMap.set(record.Group, []);
    }
    groupMap.get(record.Group)!.push(foodItem);
  }

  return MEAL_ORDER.filter((mealType) => groupedByMeal.has(mealType)).map((mealType) => {
    const groupsMap = groupedByMeal.get(mealType)!;
    const groups = Array.from(groupsMap.entries()).map(([name, items]) => ({
      name: name || "Chef's Choice",
      items: [...items].sort((a, b) => b.todayRating - a.todayRating)
    }));
    const flatItems = groups.flatMap((group) => group.items);
    const ratingToday =
      flatItems.length === 0
        ? 0
        : flatItems.reduce((sum, item) => sum + item.todayRating, 0) / flatItems.length;
    const ratingOverall =
      flatItems.length === 0
        ? 0
        : flatItems.reduce((sum, item) => sum + item.overallRating, 0) / flatItems.length;

    return {
      type: mealType,
      name: formatMealType(mealType),
      timeRange: getMealTimeRange(mealType),
      ratingToday,
      ratingOverall,
      groups
    };
  });
}



