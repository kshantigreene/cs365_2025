// Simple local-time meal detection.
// Adjust windows as needed for your campus schedules.
export type MealType = "breakfast" | "lunch" | "dinner";

export function getCurrentMeal(now = new Date()): MealType {
  const hour = now.getHours(); // 0..23 local time

  // Example windows (tune to your needs):
  // Breakfast: 5:00–10:59
  // Lunch:     11:00–15:59
  // Dinner:    16:00–21:59
  if (hour >= 5 && hour <= 10) return "breakfast";
  if (hour >= 11 && hour <= 15) return "lunch";
  if (hour >= 16 && hour <= 21) return "dinner";

  // Outside windows → pick next upcoming slot (or dinner by default)
  return "dinner";
}
