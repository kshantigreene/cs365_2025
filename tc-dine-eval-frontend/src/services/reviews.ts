import { useQuery } from "@tanstack/react-query";
import { api, hasRemoteBackend } from "./api";
import type { Review } from "../types/review";

const REVIEWS_SAMPLE_PATH = "/reviews-sample.json";
const LOCAL_STORAGE_KEY = "tc-dine-eval-reviews";

function readLocalReviews(): Review[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Review[]) : [];
  } catch {
    return [];
  }
}

function saveLocalReviews(reviews: Review[]): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reviews));
}

async function fetchSampleReviews(): Promise<Review[]> {
  try {
    const response = await fetch(REVIEWS_SAMPLE_PATH);
    if (!response.ok) {
      return [];
    }
    return (await response.json()) as Review[];
  } catch {
    return [];
  }
}

export async function fetchReviews(foodItemId: string): Promise<Review[]> {
  if (hasRemoteBackend) {
    const { data } = await api.get<Review[]>("/reviews", { params: { foodItemId } });
    return data;
  }

  const sample = await fetchSampleReviews();
  const local = readLocalReviews();
  return [...sample, ...local]
    .filter((review) => review.foodItemId === foodItemId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export interface SubmitReviewPayload {
  foodItemId: string;
  rating: number;
  comment: string;
}

export async function submitReview(payload: SubmitReviewPayload): Promise<Review> {
  if (hasRemoteBackend) {
    const { data } = await api.post<Review>("/reviews", payload);
    return data;
  }

  const id = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

  const review: Review = {
    id,
    foodItemId: payload.foodItemId,
    rating: payload.rating,
    comment: payload.comment,
    date: new Date().toISOString()
  };
  const existing = readLocalReviews();
  saveLocalReviews([...existing, review]);
  return review;
}

export function useReviews(foodItemId: string | undefined) {
  return useQuery({
    queryKey: ["reviews", foodItemId],
    queryFn: () => fetchReviews(foodItemId!),
    enabled: Boolean(foodItemId)
  });
}



