import { getUser } from "@/lib/supabase/server";
import Navbar from "./Navbar";

export default async function Header() {
  const user = await getUser();
  const showOwnerLogin = Boolean(process.env.DEMO_ADMIN_EMAIL);

  return <Navbar user={user} showOwnerLogin={showOwnerLogin} />;
}
