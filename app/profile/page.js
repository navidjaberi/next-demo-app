import { redirect } from "next/navigation";
import { Heart, Receipt } from "lucide-react";
import FoodCard from "@/components/FoodCard";
import { getFavoriteFoods, getOrders } from "@/lib/foods";
import { formatDate, formatPrice } from "@/lib/format";
import { getUser } from "@/lib/supabase/server";
import ChangePasswordForm from "./ChangePasswordForm";
import ProfileForm from "./ProfileForm";
import styles from "./profile.module.css";

export const metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const user = await getUser();

  if (!user) {
    redirect("/login?next=/profile");
  }

  const [favorites, orders] = user.isAdmin
    ? [[], []]
    : await Promise.all([getFavoriteFoods(user.id), getOrders(user.id)]);

  return (
    <>
      <h1 className="page-title">My profile</h1>
      <p className="page-subtitle">
        Signed in as {user.email}
        {user.isAdmin && " (admin)"}
      </p>

      <section className={styles.section}>
        <ProfileForm user={user} />
      </section>

      {!user.isAdmin && (
        <>
          <section className={styles.section}>
            <h2>
              <Receipt size={22} /> My orders
            </h2>

            {orders.length === 0 ? (
              <p className={styles.empty}>You have not ordered anything yet.</p>
            ) : (
              <div className={styles.orders}>
                {orders.map((order) => (
                  <div key={order.id} className={`card ${styles.order}`}>
                    <div className={styles.orderHeader}>
                      <strong>Order #{order.id}</strong>
                      <span className={`${styles.status} ${styles[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className={styles.date}>{formatDate(order.created_at)}</p>
                    <ul className={styles.orderItems}>
                      {order.items.map((item) => (
                        <li key={item.id}>
                          <span>
                            {item.quantity} × {item.name}
                          </span>
                          <span>{formatPrice(item.price * item.quantity)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className={styles.orderTotal}>
                      <span>Total</span>
                      <span>{formatPrice(order.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className={styles.section}>
            <h2>
              <Heart size={22} /> Favorite foods
            </h2>

            {favorites.length === 0 ? (
              <p className={styles.empty}>
                You have no favorites yet. Tap the heart on any food to save it here.
              </p>
            ) : (
              <div className="food-grid">
                {favorites.map((food) => (
                  <FoodCard key={food.id} food={food} user={user} isFavorite />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      <section className={styles.section}>
        <h2>Change password</h2>
        <ChangePasswordForm />
      </section>
    </>
  );
}
