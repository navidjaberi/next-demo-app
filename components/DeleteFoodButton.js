"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteFood } from "@/app/foods/actions";

export default function DeleteFoodButton({ foodId }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleClick() {
    if (!confirm("Are you sure you want to delete this food?")) {
      return;
    }

    startTransition(async () => {
      const result = await deleteFood(foodId);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div>
      <button className="btn btn-danger" onClick={handleClick} disabled={isPending}>
        <Trash2 size={16} />
        {isPending ? "Deleting..." : "Delete"}
      </button>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
