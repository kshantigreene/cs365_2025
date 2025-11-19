import { useParams } from "react-router-dom";
export default function FoodItemDetailPage() {
  const { id } = useParams();
  return <h1 style={{padding:16}}>Food Item ID: {id}</h1>;
}
