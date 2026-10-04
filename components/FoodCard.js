import Link from "next/link";
import { formatPrice } from "@/lib/format";
import FoodImage from "./FoodImage";
import AddToCartButton from "./AddToCartButton";
import FavoriteButton from "./FavoriteButton";
import styles from "./FoodCard.module.css";

export default function FoodCard({ food, isLoggedIn, isFavorite, eager = false }) {
  return (
    <article className={styles.card}>
      <Link href={`/foods/${food.id}`} className={styles.imageWrapper}>
        <FoodImage
          src={food.image_url}
          alt={food.name}
          sizes="(max-width: 600px) 100vw, 300px"
          eager={eager}
        />
      </Link>

      {isLoggedIn && (
        <div className={styles.favorite}>
          <FavoriteButton foodId={food.id} initialFavorite={isFavorite} />
        </div>
      )}

      <div className={styles.body}>
        <span className={styles.category}>{food.category}</span>
        <Link href={`/foods/${food.id}`}>
          <h3 className={styles.name}>{food.name}</h3>
        </Link>
        <p className={styles.ingredients}>{food.ingredients}</p>

        <div className={styles.footer}>
          <span className={styles.price}>{formatPrice(food.price)}</span>
          <AddToCartButton food={food} />
        </div>
      </div>
    </article>
  );
}
