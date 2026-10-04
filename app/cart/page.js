import { getUser } from "@/lib/supabase/server";
import CartView from "./CartView";

export const metadata = {
  title: "Cart",
};

export default async function CartPage() {
  const user = await getUser();

  return (
    <>
      <h1 className="page-title">Your cart</h1>
      {user?.isAdmin ? (
        <p className="empty-state">Admin accounts can not place orders.</p>
      ) : (
        <CartView isLoggedIn={!!user} />
      )}
    </>
  );
}
