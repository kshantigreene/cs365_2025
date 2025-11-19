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
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: submitReview,
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
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
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
        {mutation.isPending ? "Submitting..." : "Submit review"}
      </button>
    </form>
  );
}
