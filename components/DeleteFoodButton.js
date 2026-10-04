"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteFood } from "@/app/admin/actions";
import ConfirmModal from "./ConfirmModal";

export default function DeleteFoodButton({ foodId, foodName }) {
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleDelete() {
    setError("");

    startTransition(async () => {
      const result = await deleteFood(foodId);
      if (result.error) {
        setError(result.error);
      }
      setShowModal(false);
    });
  }

  return (
    <div>
      <button
        className="icon-btn"
        onClick={() => setShowModal(true)}
        aria-label={`Delete ${foodName}`}
      >
        <Trash2 size={16} />
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
