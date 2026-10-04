import { getUser } from "@/lib/supabase/server";
import Navbar from "./Navbar";

export default async function Header() {
  const user = await getUser();

  return <Navbar user={user} />;
}
