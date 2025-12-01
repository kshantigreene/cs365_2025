import { Link } from "react-router-dom";
import { getCurrentMeal } from "../utils/GetCurrentMeals";
import type { MealType } from "../utils/GetCurrentMeals";
// ^ adjust the filename if yours is slightly different

export default function HomePage() {
  const currentMeal = getCurrentMeal();
  const meals: MealType[] = ["breakfast", "lunch", "dinner"];

  return (
    <main style={{ padding: 16 }}>
      <h1>Home Page</h1>

      <p style={{ marginTop: 8 }}>
        Current meal based on time: <b>{currentMeal}</b>
      </p>

      <ul>
        {meals.map((meal) => (
          <li
            key={meal}
            style={{ fontWeight: meal === currentMeal ? "bold" : "normal" }}
          >
            <Link to={`/meal/${meal}`}>
              Go to {meal.charAt(0).toUpperCase() + meal.slice(1)}
            </Link>

            {meal === currentMeal && " ← active now"}
          </li>
         ))}
      </ul>
    </main>
  );
}
