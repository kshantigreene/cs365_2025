<<<<<<< HEAD
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import StarRating from "./StarRating";
import { submitReview } from "../services/reviews";

const schema = z.object({
  rating: z.number().min(1).max(5),
  message: z.string().trim().min(1)
});

type Props = { foodItemId: string; userID?: string | null };

export default function ReviewForm({ foodItemId, userID = null }: Props) {
  const qc = useQueryClient();
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
=======
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
>>>>>>> d28bd9aea6d516f218774cdf28f516c9fca1d6cb
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: submitReview,
<<<<<<< HEAD
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: ["foodItem", foodItemId] });
      const prev = qc.getQueryData<any>(["foodItem", foodItemId]);
      if (prev) {
        qc.setQueryData(["foodItem", foodItemId], {
          ...prev,
          reviews: [
            ...(prev.reviews ?? []),
            {
              id: "temp-" + Math.random().toString(36).slice(2),
              userID: payload.userID ?? null,
              rating: payload.rating,
              message: payload.message,
              date: new Date().toISOString()
            }
          ]
        });
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["foodItem", foodItemId], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["foodItem", foodItemId] });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse({ rating, message });
=======
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
>>>>>>> d28bd9aea6d516f218774cdf28f516c9fca1d6cb
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
<<<<<<< HEAD
    await mutation.mutateAsync({ foodItemId, rating, message, userID });
    setRating(0);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 border rounded-xl">
      <div>
        <label className="block text-sm font-medium mb-1">Your rating</label>
        <StarRating value={rating} onChange={setRating} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Comment</label>
        <textarea
          className="w-full border rounded-md p-2"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What did you think?"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-50"
        disabled={mutation.isPending}
      >
=======
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
>>>>>>> d28bd9aea6d516f218774cdf28f516c9fca1d6cb
        {mutation.isPending ? "Submitting..." : "Submit review"}
      </button>
    </form>
  );
}
<<<<<<< HEAD
=======



>>>>>>> d28bd9aea6d516f218774cdf28f516c9fca1d6cb
