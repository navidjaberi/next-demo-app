import { useRouter } from "next/router";
import { Fragment, useContext, useRef, useState } from "react";
import AuthContext from "../store/authContex";
import classes from "../styles/signin.module.css";
import spiner from "../styles/spiner.module.css";
const Signin = () => {
  const [login, setLogin] = useState(true);
  const [errormsg, setErrormsg] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailref = useRef();
  const passref = useRef();
  const rePassref = useRef();

  const router = useRouter();
  const authCtx = useContext(AuthContext);

  const changeHandler = () => {
    setErrormsg("");
    setLoading(false);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const enteredEmail = emailref.current.value;
    const enteredPass = passref.current.value;

    if (!login) {
      const enteredRepass = rePassref.current.value;
      if (enteredPass !== enteredRepass) {
        setErrormsg("Passwords do not match");
        return;
      }
    }

    setLoading(true);
    setErrormsg("");

    try {
      if (login) {
        // LOGIN
        await authCtx.login(enteredEmail, enteredPass);
      } else {
        // SIGNUP
        await authCtx.signup(enteredEmail, enteredPass);
      }

      setSuccessful(true);
      router.push("/myprofile");
    } catch (err) {
      setErrormsg(err.message || "Authentication failed");
      setSuccessful(false);
    } finally {
      setLoading(false);
    }
  };

  const toggleModeHandler = () => {
    setLogin((prev) => !prev);
    setErrormsg("");
    setSuccessful(false);
  };

  return (
    <Fragment>
      <div className={classes.form}>
        <h1>{login ? "Sign in" : "Sign Up"}</h1>

        <form onSubmit={submitHandler}>
          <div className={classes.control}>
            <label htmlFor="email">Enter your Email</label>
            <input
              type="email"
              id="email"
              ref={emailref}
              onChange={changeHandler}
            />
          </div>

          <div className={classes.control}>
            <label htmlFor="password">
              {login ? "Enter your Password" : "Create Password"}
            </label>
            <input
              type="password"
              id="password"
              ref={passref}
              onChange={changeHandler}
            />
          </div>

          {!login && (
            <div className={classes.control}>
              <label htmlFor="repassword">Repeat Password</label>
              <input
                type="password"
                id="repassword"
                ref={rePassref}
                onChange={changeHandler}
              />
            </div>
          )}

          <button type="submit">{login ? "Sign in" : "Sign Up"}</button>

          {loading && <p className={spiner.loader}>sending...</p>}

          {errormsg && (
            <p style={{ color: "red", fontWeight: "bold" }}>{errormsg}</p>
          )}

          {successful && (
            <p style={{ color: "green", fontWeight: "bold" }}>Success!</p>
          )}

          <p>
            <a onClick={toggleModeHandler}>
              {login ? "Create a new account" : "Already have an account?"}
            </a>
          </p>
        </form>
      </div>
    </Fragment>
  );
};

export default Signin;
