import { useParams } from "react-router-dom";
export default function MealDetailPage() {
  const { mealType } = useParams();
  return <h1 style={{padding:16}}>Meal: {mealType}</h1>;
}
