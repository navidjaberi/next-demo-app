"use client";

import { useActionState, useState } from "react";
import { Star } from "lucide-react";
import { addReview } from "@/app/foods/actions";
import styles from "./reviews.module.css";

export default function ReviewForm({ foodId }) {
  const [state, formAction, isPending] = useActionState(addReview.bind(null, foodId), {});
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <form action={formAction} className={`card form ${styles.form}`}>
      <div className="field">
        <label>Your rating</label>
        <div className={styles.starInput} onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              aria-label={`${star} stars`}
            >
              <Star
                size={26}
                fill="currentColor"
                className={star <= (hover || rating) ? styles.starOn : styles.starOff}
              />
            </button>
          ))}
        </div>
        <input type="hidden" name="rating" value={rating} />
      </div>

      <div className="field">
        <label htmlFor="comment">Your comment</label>
        <textarea
          className="input"
          id="comment"
          name="comment"
          rows={3}
          maxLength={500}
          defaultValue={state.comment}
          placeholder="What did you think about this food?"
          required
        />
      </div>

      {state.error && <p className="alert alert-error">{state.error}</p>}

      <button className="btn btn-primary" type="submit" disabled={isPending || rating === 0}>
        {isPending ? "Sending..." : "Send review"}
      </button>
    </form>
  );
}
