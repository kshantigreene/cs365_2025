import { api } from "./api";
import type { Review } from "../types/review";

export async function submitReview(payload: {
  foodItemId: string;
  rating: number;
  message: string;
  userID?: string | null;
}): Promise<Review> {
  const { data } = await api.post("/reviews", payload);
  return data;
}
