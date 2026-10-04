import Link from "next/link";
import { Search, SearchX } from "lucide-react";
import FoodCard from "@/components/FoodCard";
import { categories } from "@/lib/categories";
import { getFavoriteIds, getFoods } from "@/lib/foods";
import { getUser } from "@/lib/supabase/server";
import styles from "./foods.module.css";

export const metadata = {
  title: "Menu",
};

export default async function FoodsPage({ searchParams }) {
  const { search = "", category = "" } = await searchParams;
  const user = await getUser();
  const [foods, favoriteIds] = await Promise.all([
    getFoods({ search, category }),
    getFavoriteIds(user?.id),
  ]);

  function categoryLink(value) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (value) params.set("category", value);
    const query = params.toString();
    return query ? `/foods?${query}` : "/foods";
  }

  return (
    <>
      <h1 className="page-title">Our Menu</h1>
      <p className="page-subtitle">Find something you love and add it to your cart.</p>

      <form className={styles.search} action="/foods">
        <Search size={18} />
        <input
          className="input"
          type="search"
          name="search"
          placeholder="Search foods..."
          defaultValue={search}
        />
        {category && <input type="hidden" name="category" value={category} />}
        <button className="btn btn-primary" type="submit">
          Search
        </button>
      </form>

      <div className={styles.categories}>
        <Link
          href={categoryLink("")}
          className={!category ? styles.activeCategory : styles.category}
        >
          All
        </Link>
        {categories.map((item) => (
          <Link
            key={item}
            href={categoryLink(item)}
            className={category === item ? styles.activeCategory : styles.category}
          >
            {item}
          </Link>
        ))}
      </div>

      {foods.length === 0 ? (
        <div className="empty-state">
          <SearchX size={40} />
          <p>No foods found. Try another search or category.</p>
        </div>
      ) : (
        <div className="food-grid">
          {foods.map((food, index) => (
            <FoodCard
              key={food.id}
              food={food}
              eager={index < 4}
              user={user}
              isFavorite={favoriteIds.includes(food.id)}
            />
          ))}
        </div>
      )}
    </>
  );
}
