import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";
import DeleteFoodButton from "@/components/DeleteFoodButton";
import FavoriteButton from "@/components/FavoriteButton";
import FoodImage from "@/components/FoodImage";
import { getFavoriteIds, getFood } from "@/lib/foods";
import { formatPrice } from "@/lib/format";
import { getUser } from "@/lib/supabase/server";
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

  const favoriteIds = await getFavoriteIds(user?.id);
  const isOwner = user && user.id === food.created_by;

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
            priority
          />
        </div>

        <div className={styles.info}>
          <span className={styles.category}>{food.category}</span>
          <h1>{food.name}</h1>
          <p className={styles.price}>{formatPrice(food.price)}</p>
          <p className={styles.description}>{food.description}</p>

          <h3>Ingredients</h3>
          <p className={styles.ingredients}>{food.ingredients}</p>

          <div className={styles.actions}>
            <AddToCartButton food={food} large />
            {user && (
              <FavoriteButton
                foodId={food.id}
                initialFavorite={favoriteIds.includes(food.id)}
              />
            )}
            {isOwner && <DeleteFoodButton foodId={food.id} />}
          </div>
        </div>
      </div>
    </>
  );
}
