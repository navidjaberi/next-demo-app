import { Star } from "lucide-react";
import styles from "./Stars.module.css";

export default function Stars({ rating, size = 16 }) {
  return (
    <span className={styles.stars} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= Math.round(rating) ? styles.filled : styles.empty}
          fill="currentColor"
        />
      ))}
    </span>
  );
}
