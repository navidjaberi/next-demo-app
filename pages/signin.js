import { useRouter } from "next/router";
import { Fragment, useContext, useRef, useState } from "react";

import AuthContex from "../store/authContex";
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
  const Authctx = useContext(AuthContex);
  const changeHandler = () => {
    setErrormsg("");
    setLoading(false);
  };
  const submitHandler = async (e) => {
    e.preventDefault();

    const entredEmail = emailref.current.value;
    const entredPass = passref.current.value;

    let url = "";
    if (!login) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCLu0A1Edyk8jBfP7DxCWn-fzWL6xL1JzU";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCLu0A1Edyk8jBfP7DxCWn-fzWL6xL1JzU";
    }
    if (!login) {
      const entredRepass = rePassref.current.value;
      if (entredPass !== entredRepass) {
        setErrormsg("passwords did not match");
        return;
      }
    }
    setLoading(true);

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email: entredEmail,
          password: entredPass,
          returnSecureToken: true,
        }),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        setLoading(false);
        const data = await response.json();
        Authctx.login(data.idToken, data.email);
        router.push("/myprofile");
      } else {
        const data = await response.json();
        if (data && data.error && data.error.message) {
          setErrormsg(data.error.message);
          setLoading(false);
        } else {
          setErrormsg("something goes Wrong");
          setSuccessful(false);
        }
      }
    } catch (err) {
      setErrormsg("Network connection error");
      setSuccessful(false);
      setLoading(false);
    }
  };
  const singChangeHandler = () => {
    setLogin((preState) => !preState);
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
            ></input>
          </div>
          {login && (
            <div className={classes.control}>
              <label htmlFor="password"> Enter your Password</label>
              <input
                type="password"
                id="password"
                ref={passref}
                onChange={changeHandler}
              ></input>
            </div>
          )}{" "}
          {!login && (
            <div className={classes.control}>
              <label htmlFor="password"> Enter a Password</label>
              <input
                type="password"
                id="password"
                ref={passref}
                onChange={changeHandler}
              ></input>
            </div>
          )}
          {!login && (
            <div className={classes.control}>
              <label htmlFor="repassword">Repeat Password</label>
              <input
                type="password"
                id="repassword"
                ref={rePassref}
                onChange={changeHandler}
              ></input>
            </div>
          )}
          <button onClick={submitHandler}>
            {login ? "Sign in" : "Sign Up"}
          </button>
          {!successful && (
            <p style={{ color: "red", fontWeight: "bold" }}>{errormsg}</p>
          )}
          {loading && <p className={spiner.loader}>sending...</p>}
          <p>
            <a onClick={singChangeHandler}>
              {!login ? "Already have an Account?" : "Create a New Account"}
            </a>
          </p>
        </form>
      </div>
    </Fragment>
  );
};
export default Signin;
