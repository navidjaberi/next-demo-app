import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Leaf, ShoppingBag } from "lucide-react";
import FoodCard from "@/components/FoodCard";
import { getFavoriteIds, getFoods } from "@/lib/foods";
import { getUser } from "@/lib/supabase/server";
import styles from "./page.module.css";

const features = [
  {
    icon: Leaf,
    title: "Fresh ingredients",
    text: "Everything is cooked the same day with local ingredients.",
  },
  {
    icon: Clock,
    title: "Fast delivery",
    text: "Your food arrives hot, usually in less than 30 minutes.",
  },
  {
    icon: ShoppingBag,
    title: "Easy ordering",
    text: "Add to cart, check out and follow your orders in your profile.",
  },
];

export default async function HomePage() {
  const user = await getUser();
  const [foods, favoriteIds] = await Promise.all([
    getFoods({ limit: 3 }),
    getFavoriteIds(user?.id),
  ]);

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.tag}>Fresh &amp; hot, every day</span>
          <h1>Enjoy the best meal of your day</h1>
          <p>
            Pizza, burgers, pasta and more, made with fresh ingredients and
            delivered right to your door.
          </p>
          <div className={styles.heroButtons}>
            <Link href="/foods" className="btn btn-primary btn-lg">
              See the menu
              <ArrowRight size={18} />
            </Link>
            {!user && (
              <Link href="/login?mode=signup" className="btn btn-outline btn-lg">
                Create an account
              </Link>
            )}
          </div>
        </div>
        <div className={styles.heroImage}>
          <Image
            src="/foods/pizza.jpg"
            alt="Italian pizza"
            fill
            loading="eager"
            sizes="(max-width: 800px) 100vw, 50vw"
          />
        </div>
      </section>

      <section className={styles.features}>
        {features.map((feature) => (
          <div key={feature.title} className={styles.feature}>
            <feature.icon size={28} />
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </div>
        ))}
      </section>

      <section>
        <div className={styles.sectionHeader}>
          <h2>New on the menu</h2>
          <Link href="/foods" className={styles.seeAll}>
            See all <ArrowRight size={16} />
          </Link>
        </div>

        {foods.length === 0 ? (
          <p className="empty-state">No foods yet. Please check back soon.</p>
        ) : (
          <div className="food-grid">
            {foods.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                user={user}
                isFavorite={favoriteIds.includes(food.id)}
                eager
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
