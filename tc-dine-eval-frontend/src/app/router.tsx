
import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import MealDetailPage from "../pages/MealDetailPage";
import FoodItemDetailPage from "../pages/FoodItemDetailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/meal/:mealType",
    element: <MealDetailPage />,
  },
  {
    path: "/food/:id",
    element: <FoodItemDetailPage />,
  },
  {
    path: "*",
    element: <div>404 Not Found</div>,
  },
]);
