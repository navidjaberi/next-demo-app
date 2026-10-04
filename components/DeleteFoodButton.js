"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteFood } from "@/app/foods/actions";
import ConfirmModal from "./ConfirmModal";

export default function DeleteFoodButton({ foodId, foodName }) {
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleDelete() {
    setError("");

    startTransition(async () => {
      const result = await deleteFood(foodId);
      if (result?.error) {
        setError(result.error);
        setShowModal(false);
      }
    });
  }

  return (
    <div>
      <button className="btn btn-danger" onClick={() => setShowModal(true)}>
        <Trash2 size={16} />
        Delete
      </button>
      {error && <p className="field-error">{error}</p>}

      <ConfirmModal
        open={showModal}
        title="Delete food"
        message={`Are you sure you want to delete "${foodName}"? This cannot be undone.`}
        confirmText="Delete"
        danger
        isPending={isPending}
        onConfirm={handleDelete}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
