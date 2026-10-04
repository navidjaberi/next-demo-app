"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ownerLogin } from "./actions";
import styles from "./login.module.css";

export default function OwnerForm() {
  const [state, formAction, isPending] = useActionState(ownerLogin, {});

  return (
    <div className={`card ${styles.wrapper}`}>
      <h1>Owner sign in</h1>
      <p className={styles.subtitle}>Sign in with the owner account to manage orders and the menu.</p>

      <form action={formAction} className="form">
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            className="input"
            type="email"
            id="email"
            name="email"
            defaultValue={state.email}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            className="input"
            type="password"
            id="password"
            name="password"
            required
          />
        </div>

        {state.error && <p className="alert alert-error">{state.error}</p>}

        <button className="btn btn-primary" type="submit" disabled={isPending}>
          {isPending ? "Please wait..." : "Sign in as owner"}
        </button>
      </form>

      <p className={styles.switch}>
        Not the owner? <Link href="/login">Sign in as a customer</Link>
      </p>
    </div>
  );
}
