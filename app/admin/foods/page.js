import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import DeleteFoodButton from "@/components/DeleteFoodButton";
import FoodImage from "@/components/FoodImage";
import Stars from "@/components/Stars";
import { getFoods } from "@/lib/foods";
import { formatPrice } from "@/lib/format";
import styles from "../admin.module.css";

export default async function AdminFoodsPage() {
  const foods = await getFoods();

  return (
    <>
      <div className={styles.toolbar}>
        <span className={styles.count}>{foods.length} foods on the menu</span>
        <Link href="/admin/foods/new" className="btn btn-primary">
          <Plus size={16} />
          Add food
        </Link>
      </div>

      <div className={styles.list}>
        {foods.map((food) => (
          <div key={food.id} className={`card ${styles.food}`}>
            <div className={styles.thumb}>
              <FoodImage src={food.image_url} alt={food.name} sizes="64px" eager />
            </div>
            <div className={styles.foodInfo}>
              <Link href={`/foods/${food.id}`} className={styles.foodName}>
                {food.name}
              </Link>
              <span className={styles.muted}>
                {food.category} · {formatPrice(food.price)}
              </span>
              <Stars rating={food.rating} size={12} />
            </div>
            <div className={styles.foodActions}>
              <Link
                href={`/admin/foods/${food.id}/edit`}
                className="icon-btn"
                aria-label={`Edit ${food.name}`}
              >
                <Pencil size={16} />
              </Link>
              <DeleteFoodButton foodId={food.id} foodName={food.name} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
