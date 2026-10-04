"use client";

import { useActionState } from "react";
import { changePassword } from "./actions";
import styles from "./profile.module.css";

export default function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(changePassword, {});

  return (
    <form action={formAction} className={`card form ${styles.passwordForm}`}>
      <div className="field">
        <label htmlFor="password">New password</label>
        <input
          className="input"
          type="password"
          id="password"
          name="password"
          minLength={6}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="confirmPassword">Repeat new password</label>
        <input
          className="input"
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          minLength={6}
          required
        />
      </div>

      {state.error && <p className="alert alert-error">{state.error}</p>}
      {state.message && <p className="alert alert-success">{state.message}</p>}

      <button className="btn btn-primary" type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Change password"}
      </button>
    </form>
  );
}
