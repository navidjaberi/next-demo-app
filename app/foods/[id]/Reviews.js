import Link from "next/link";
import { MessageSquare } from "lucide-react";
import Avatar from "@/components/Avatar";
import Stars from "@/components/Stars";
import { formatDate } from "@/lib/format";
import DeleteReviewButton from "./DeleteReviewButton";
import ReviewForm from "./ReviewForm";
import styles from "./reviews.module.css";

export default function Reviews({ foodId, reviews, user }) {
  const hasReviewed = user && reviews.some((review) => review.user_id === user.id);

  return (
    <section className={styles.section}>
      <h2>
        <MessageSquare size={22} /> Reviews ({reviews.length})
      </h2>

      {!user && (
        <p className={styles.note}>
          <Link href={`/login?next=/foods/${foodId}`}>Sign in</Link> to write a review.
        </p>
      )}

      {user && !user.isAdmin && !hasReviewed && <ReviewForm foodId={foodId} />}

      {reviews.length === 0 ? (
        <p className={styles.note}>No reviews yet. Be the first one!</p>
      ) : (
        <ul className={styles.list}>
          {reviews.map((review) => (
            <li key={review.id} className={styles.review}>
              <Avatar
                src={review.profiles?.avatar_url}
                name={review.profiles?.full_name}
                size={40}
              />
              <div className={styles.body}>
                <div className={styles.header}>
                  <strong>{review.profiles?.full_name || "Customer"}</strong>
                  <span className={styles.date}>{formatDate(review.created_at)}</span>
                </div>
                <Stars rating={review.rating} size={14} />
                <p>{review.comment}</p>
              </div>
              {user && (user.id === review.user_id || user.isAdmin) && (
                <DeleteReviewButton reviewId={review.id} foodId={foodId} />
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
