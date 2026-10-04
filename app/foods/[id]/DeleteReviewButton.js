"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";
import { deleteReview } from "@/app/foods/actions";

export default function DeleteReviewButton({ reviewId, foodId }) {
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteReview(reviewId, foodId);
      setShowModal(false);
    });
  }

  return (
    <>
      <button
        className="icon-btn"
        onClick={() => setShowModal(true)}
        aria-label="Delete review"
      >
        <Trash2 size={16} />
      </button>

      <ConfirmModal
        open={showModal}
        title="Delete review"
        message="Are you sure you want to delete this review?"
        confirmText="Delete"
        danger
        isPending={isPending}
        onConfirm={handleDelete}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
