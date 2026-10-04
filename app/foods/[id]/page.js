import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";
import FavoriteButton from "@/components/FavoriteButton";
import FoodImage from "@/components/FoodImage";
import Stars from "@/components/Stars";
import { getFavoriteIds, getFood, getReviews } from "@/lib/foods";
import { formatPrice } from "@/lib/format";
import { getUser } from "@/lib/supabase/server";
import Reviews from "./Reviews";
import styles from "./detail.module.css";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const food = await getFood(id);

  return {
    title: food ? food.name : "Food not found",
    description: food?.description,
  };
}

export default async function FoodDetailPage({ params }) {
  const { id } = await params;
  const [food, user] = await Promise.all([getFood(id), getUser()]);

  if (!food) {
    notFound();
  }

  const [favoriteIds, reviews] = await Promise.all([
    getFavoriteIds(user?.id),
    getReviews(food.id),
  ]);

  return (
    <>
      <Link href="/foods" className={styles.back}>
        <ArrowLeft size={18} />
        Back to menu
      </Link>

      <div className={styles.detail}>
        <div className={styles.image}>
          <FoodImage
            src={food.image_url}
            alt={food.name}
            sizes="(max-width: 800px) 100vw, 550px"
            eager
          />
        </div>

        <div className={styles.info}>
          <span className={styles.category}>{food.category}</span>
          <h1>{food.name}</h1>
          <div className={styles.rating}>
            <Stars rating={food.rating} />
            <span>
              {food.reviewCount > 0
                ? `${food.rating} from ${food.reviewCount} ${food.reviewCount === 1 ? "review" : "reviews"}`
                : "No reviews yet"}
            </span>
          </div>
          <p className={styles.price}>{formatPrice(food.price)}</p>
          <p className={styles.description}>{food.description}</p>

          <h3>Ingredients</h3>
          <p className={styles.ingredients}>{food.ingredients}</p>

          <div className={styles.actions}>
            {user?.isAdmin ? (
              <Link href={`/admin/foods/${food.id}/edit`} className="btn btn-outline btn-lg">
                <Pencil size={16} />
                Edit food
              </Link>
            ) : (
              <AddToCartButton food={food} large />
            )}
            {user && !user.isAdmin && (
              <FavoriteButton
                foodId={food.id}
                initialFavorite={favoriteIds.includes(food.id)}
              />
            )}
          </div>
        </div>
      </div>

      <Reviews foodId={food.id} reviews={reviews} user={user} />
    </>
  );
}
