import { useContext, useEffect, useRef, useState } from "react";
import AuthContex from "../store/authContex";
import classes from "../styles/profile.module.css";
import spiner from "../styles/spiner.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import Home from ".";
import FavContex from "../store/favoriteContex";
import FavotiteItem from "../components/favoriteItem";
const Profile = () => {
  const Authctx = useContext(AuthContex);
  const favCtx = useContext(FavContex);
  const router = useRouter();
  useEffect(() => {
    if (!loggedin) {
      router.push("/");
    }
    },[])
  let content;
  if (favCtx.totalFav === 0 && favCtx.favorites.length <= 0) {
    content = <h5>Your Favorite List is empty...</h5>;
  } else {
    content = (
      <div className={classes.favcard}>
        {favCtx.favorites.map((food) => (
          <FavotiteItem
            id={food.id}
            key={food.id}
            image={food.image}
            name={food.name}
            material={food.material}
          />
        ))}
      </div>
    );
  }
  const loggedin = Authctx.isLoggedin;
  const [loading, setLoading] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const [errormsg, setErrormsg] = useState("");
  const [buttonClick, setButtonClick] = useState(false);
  const passref = useRef();
  const rePassref = useRef();



  if (!loggedin) {
    return (
      <Link href="/">
        <Home />
      </Link>
    );
  }

  const changeHandler = () => {
    setErrormsg("");
    setLoading(false);
  };
  const changePassHandler = () => {
    setButtonClick((preState) => !preState);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    const entredPass = passref.current.value;
    const entredresPass = rePassref.current.value;

    if (entredPass !== entredresPass) {
      setErrormsg("passwords did not match");
      return;
    }

    setLoading(true);
    try {
      fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCLu0A1Edyk8jBfP7DxCWn-fzWL6xL1JzU",
        {
          method: "POST",
          body: JSON.stringify({
            idToken: Authctx.token,
            password: entredPass,
            returnSecureToken: false,
          }),
          headers: { "Content-Type": "application/json" },
        }
      ).then((res) => {
        setLoading(false);
        if (res.ok) {
          res.json();
          setSuccessful(true);
        } else {
          res.json().then((data) => {
            if (data && data.error && data.error.message) {
              setErrormsg(data.error.message);
            } else {
              setErrormsg("something goes Wrong");
              setSuccessful(false);
            }
          });
        }
      });
    } catch {
      setErrormsg("Network connection error");
      setSuccessful(false);
    }
    entredPass = "";
    entredresPass = "";
  };
  return (
    <section className={classes.profile}>
      <h1>Dashboard</h1>
      <button onClick={changePassHandler}>Change Password</button>
      {buttonClick && (
        <form onSubmit={submitHandler}>
          <div className={classes.control}>
            <label htmlFor="password"> Enter New Password</label>
            <input
              type="password"
              id="password"
              ref={passref}
              onChange={changeHandler}
            ></input>
          </div>

          <div className={classes.control}>
            <label htmlFor="repassword">Repeat Password</label>
            <input
              type="password"
              id="repassword"
              ref={rePassref}
              onChange={changeHandler}
            ></input>
          </div>
          {successful && (
            <p style={{ color: "green", fontWeight: "bold" }}>
              Your password has change successfully!
            </p>
          )}

          {!successful && (
            <p style={{ color: "red", fontWeight: "bold" }}>{errormsg}</p>
          )}

          {loading && <p className={spiner.loader}>sending...</p>}

          <button onClick={submitHandler}>Submit</button>
        </form>
      )}
      <h3>Favorite Meals</h3>

      {content}
    </section>
  );
};
export default Profile;
