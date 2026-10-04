import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import AdminTabs from "./AdminTabs";

export const metadata = {
  title: "Dashboard",
};

export default async function AdminLayout({ children }) {
  const user = await getUser();

  if (!user) {
    redirect("/login?next=/admin");
  }

  if (!user.isAdmin) {
    redirect("/");
  }

  return (
    <>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Manage orders and the menu.</p>
      <AdminTabs />
      {children}
    </>
  );
}
