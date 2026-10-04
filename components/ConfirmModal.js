"use client";

import { useEffect, useRef } from "react";
import styles from "./ConfirmModal.module.css";

export default function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Confirm",
  danger = false,
  isPending = false,
  onConfirm,
  onClose,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) {
      dialog.showModal();
    }
    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function handleBackdropClick(event) {
    if (event.target === dialogRef.current && !isPending) {
      onClose();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      <div className={styles.content}>
        <h2>{title}</h2>
        <p>{message}</p>

        <div className={styles.actions}>
          <button className="btn btn-outline" onClick={onClose} disabled={isPending}>
            Cancel
          </button>
          <button
            className={`btn ${danger ? "btn-danger-solid" : "btn-primary"}`}
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </dialog>
  );
}
