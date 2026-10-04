"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import { Camera } from "lucide-react";
import Avatar from "@/components/Avatar";
import { updateAvatar, updateName } from "./actions";
import styles from "./profile.module.css";

export default function ProfileForm({ user }) {
  const [state, formAction, isSaving] = useActionState(updateName, {});
  const [isUploading, startTransition] = useTransition();
  const [avatarError, setAvatarError] = useState("");
  const fileInputRef = useRef(null);

  function handleAvatarChange(event) {
    const file = event.target.files[0];
    event.target.value = "";
    setAvatarError("");

    if (!file) {
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setAvatarError("Avatar should be smaller than 2MB.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    startTransition(async () => {
      const result = await updateAvatar(formData);
      if (result.error) {
        setAvatarError(result.error);
      }
    });
  }

  return (
    <div className={`card ${styles.profileCard}`}>
      <button
        className={styles.avatarButton}
        onClick={() => fileInputRef.current.click()}
        disabled={isUploading}
        aria-label="Change avatar"
      >
        <Avatar src={user.avatarUrl} name={user.name} size={96} />
        <span className={styles.camera}>
          <Camera size={14} />
        </span>
      </button>
      <input
        ref={fileInputRef}
        className={styles.hiddenInput}
        type="file"
        accept="image/*"
        onChange={handleAvatarChange}
      />

      <form action={formAction} className={`form ${styles.nameForm}`}>
        <div className="field">
          <label htmlFor="fullName">Display name</label>
          <div className={styles.nameRow}>
            <input
              className="input"
              id="fullName"
              name="fullName"
              defaultValue={state.name || user.name}
              minLength={2}
              maxLength={40}
              required
            />
            <button className="btn btn-primary" type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {isUploading && <p className={styles.empty}>Uploading avatar...</p>}
        {avatarError && <p className="alert alert-error">{avatarError}</p>}
        {state.error && <p className="alert alert-error">{state.error}</p>}
        {state.message && <p className="alert alert-success">{state.message}</p>}
      </form>
    </div>
  );
}
