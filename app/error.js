"use client";

import { TriangleAlert } from "lucide-react";

export default function Error({ retry }) {
  return (
    <div className="empty-state">
      <TriangleAlert size={48} />
      <h1>Something went wrong</h1>
      <p>We could not load this page. Please try again in a moment.</p>
      <button className="btn btn-primary" onClick={() => retry()}>
        Try again
      </button>
    </div>
  );
}
