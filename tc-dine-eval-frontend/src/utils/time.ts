import type { MealType } from "../types/foodItem";

type TimeRange = { start: number; end: number; label: string };

const MEAL_SCHEDULE: Record<MealType, TimeRange> = {
  BREAKFAST: { start: 7 * 60, end: 10 * 60 + 30, label: "7:00 AM – 10:30 AM" },
  LUNCH: { start: 11 * 60, end: 14 * 60 + 30, label: "11:00 AM – 2:30 PM" },
  AFTERNOON_SNACK: { start: 15 * 60, end: 17 * 60, label: "3:00 PM – 5:00 PM" },
  DINNER: { start: 17 * 60 + 30, end: 21 * 60, label: "5:30 PM – 9:00 PM" }
};

const MEAL_ORDER: MealType[] = ["BREAKFAST", "LUNCH", "AFTERNOON_SNACK", "DINNER"];

function toEasternMinutes(date = new Date()): number {
  const eastern = new Date(
    date.toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  return eastern.getHours() * 60 + eastern.getMinutes();
}

export function getMealTimeRange(meal: MealType): string {
  return MEAL_SCHEDULE[meal].label;
}

export function getCurrentMealType(date = new Date()): MealType {
  const minutes = toEasternMinutes(date);

  for (const meal of MEAL_ORDER) {
    const { start, end } = MEAL_SCHEDULE[meal];
    if (minutes >= start && minutes <= end) {
      return meal;
    }
  }

  // Before breakfast → breakfast, after dinner → dinner
  if (minutes < MEAL_SCHEDULE.BREAKFAST.start) {
    return "BREAKFAST";
  }
  return "DINNER";
}

export function getUpcomingMealType(date = new Date()): MealType {
  const minutes = toEasternMinutes(date);
  for (const meal of MEAL_ORDER) {
    if (minutes < MEAL_SCHEDULE[meal].start) {
      return meal;
    }
  }
  return "BREAKFAST";
}



