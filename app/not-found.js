import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="empty-state">
      <SearchX size={48} />
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link href="/foods" className="btn btn-primary">
        Go to the menu
      </Link>
    </div>
  );
}
