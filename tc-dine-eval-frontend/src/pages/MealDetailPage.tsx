import { useParams, Link } from "react-router-dom";

export default function MealDetailPage() {
  const { mealType } = useParams();

  return (
    <main style={{ padding: 16 }}>
      <h1>Meal Detail</h1>
      <p>mealType: <b>{mealType}</b></p>

      <Link to="/">← Back to Home</Link>
    </main>
  );
}
