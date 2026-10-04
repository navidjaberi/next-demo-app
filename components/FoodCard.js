import Link from "next/link";
import { Pencil } from "lucide-react";
import { formatPrice } from "@/lib/format";
import FoodImage from "./FoodImage";
import AddToCartButton from "./AddToCartButton";
import FavoriteButton from "./FavoriteButton";
import Stars from "./Stars";
import styles from "./FoodCard.module.css";

export default function FoodCard({ food, user, isFavorite, eager = false }) {
  const isCustomer = user && !user.isAdmin;

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

      {isCustomer && (
        <div className={styles.favorite}>
          <FavoriteButton foodId={food.id} initialFavorite={isFavorite} />
        </div>
      )}

      <div className={styles.body}>
        <span className={styles.category}>{food.category}</span>
        <Link href={`/foods/${food.id}`}>
          <h3 className={styles.name}>{food.name}</h3>
        </Link>

        <div className={styles.rating}>
          <Stars rating={food.rating} size={14} />
          <span>
            {food.reviewCount > 0 ? `${food.rating} (${food.reviewCount})` : "No reviews yet"}
          </span>
        </div>

        <p className={styles.ingredients}>{food.ingredients}</p>

        <div className={styles.footer}>
          <span className={styles.price}>{formatPrice(food.price)}</span>
          {user?.isAdmin ? (
            <Link href={`/admin/foods/${food.id}/edit`} className="btn btn-outline">
              <Pencil size={16} />
              Edit
            </Link>
          ) : (
            <AddToCartButton food={food} />
          )}
        </div>
      </div>
    </article>
  );
}
