"use client";

import { useActionState, useState } from "react";
import { login, signup } from "./actions";
import styles from "./login.module.css";

export default function AuthForm({ next, startWithSignup }) {
  const [isLogin, setIsLogin] = useState(!startWithSignup);
  const [loginState, loginAction, loginPending] = useActionState(login, {});
  const [signupState, signupAction, signupPending] = useActionState(signup, {});

  const state = isLogin ? loginState : signupState;
  const isPending = isLogin ? loginPending : signupPending;

  return (
    <div className={`card ${styles.wrapper}`}>
      <h1>{isLogin ? "Welcome back" : "Create an account"}</h1>
      <p className={styles.subtitle}>
        {isLogin
          ? "Sign in to order food and save your favorites."
          : "Sign up in a few seconds and start ordering."}
      </p>

      <form action={isLogin ? loginAction : signupAction} className="form">
        <input type="hidden" name="next" value={next} />

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
            minLength={6}
            required
          />
        </div>

        {!isLogin && (
          <div className="field">
            <label htmlFor="confirmPassword">Repeat password</label>
            <input
              className="input"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              minLength={6}
              required
            />
          </div>
        )}

        {state.error && <p className="alert alert-error">{state.error}</p>}
        {state.message && <p className="alert alert-success">{state.message}</p>}

        <button className="btn btn-primary" type="submit" disabled={isPending}>
          {isPending ? "Please wait..." : isLogin ? "Sign in" : "Sign up"}
        </button>
      </form>

      <p className={styles.switch}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button type="button" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Sign up" : "Sign in"}
        </button>
      </p>
    </div>
  );
}
