import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { submitReview } from "../services/reviews";
import StarRating from "./StarRating";
import type { Review } from "../types/review";

const schema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().trim().min(4, "Please share a bit more detail.")
});

type Props = {
  foodItemId: string;
  foodItemName: string;
};

export default function ReviewForm({ foodItemId, foodItemName }: Props) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: submitReview,
    onMutate: async (variables: Parameters<typeof submitReview>[0]) => {
      await queryClient.cancelQueries({ queryKey: ["reviews", variables.foodItemId] });
      const previous = queryClient.getQueryData<Review[]>(["reviews", variables.foodItemId]) ?? [];
      const optimistic: Review = {
        id: `temp-${Math.random().toString(36).slice(2)}`,
        foodItemId: variables.foodItemId,
        rating: variables.rating,
        comment: variables.comment,
        date: new Date().toISOString()
      };
      queryClient.setQueryData<Review[]>(["reviews", variables.foodItemId], [
        optimistic,
        ...previous
      ]);
      return { previous };
    },
    onError: (_error, variables, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["reviews", variables.foodItemId], ctx.previous);
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.foodItemId] });
    }
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const parsed = schema.safeParse({ rating, comment });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    await mutation.mutateAsync({ foodItemId, rating, comment });
    setRating(0);
    setComment("");
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>Leave a review for {foodItemName}</h3>
      <label className="form-field">
        <span>Your rating</span>
        <StarRating value={rating} onChange={setRating} />
      </label>
      <label className="form-field">
        <span>Your comment</span>
        <textarea
          value={comment}
          rows={4}
          onChange={(event) => setComment(event.target.value)}
          placeholder="What did you think?"
          required
        />
      </label>
      {error && <p className="form-error">{error}</p>}
      <button className="button" type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Submitting..." : "Submit review"}
      </button>
    </form>
  );
}



