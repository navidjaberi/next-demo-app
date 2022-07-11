import Link from "next/link";
import classes from "../styles/header.module.css";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { cartShownActions } from "../store/cartShown";
import { Fragment, useContext, useEffect, useState } from "react";
import ShoppingCart from "../components/shoppingCart";
import { useSelector } from "react-redux";
import AuthContex from "../store/authContex";

const Header = () => {
  const Authctx = useContext(AuthContex);
  const isLoggedin = Authctx.isLoggedin;
  const [showEmail, setShowEmail] = useState(null);

  useEffect(() => {
    setShowEmail(Authctx.email);
  }, [isLoggedin]);
  const cartShown = useSelector((state) => state.CartShown.cartIsShown);
  const router = useRouter();
  const dispath = useDispatch();
  const cartHandler = () => {
    dispath(cartShownActions.toggle());
  };
  const cartNum = useSelector((state) => state.cartItems.totatAmount);
  const signoutHandler = () => {
    Authctx.logout();
    router.push("/");
  };

  return (
    <Fragment>
      <section className={classes.header}>
        <div className={classes.title}>
          <h1>food App</h1>
          <h4>{showEmail}</h4>
        </div>
        <div className={classes.nav}>
          <div className={classes.control}>
            {isLoggedin && (
              <button onClick={cartHandler}>
                Shopping Cart{" "}
                <FontAwesomeIcon
                  icon={faCartShopping}
                  style={{ margin: "1.5px" }}
                />
                <span className={classes.badge}>{cartNum}</span>
              </button>
            )}

            {isLoggedin && (
              <button className={classes.signout} onClick={signoutHandler}>
                Sign Out
              </button>
            )}
          </div>
          <ul className={classes.mainmenu}>
            <li
              className={
                router.pathname == "/" ? classes.active : classes.notactive
              }
            >
              <Link href="/">Home</Link>
            </li>

            <li
              className={
                router.pathname == "/foods" ? classes.active : classes.notactive
              }
            >
              <Link href="/foods">Foods</Link>
            </li>
            {isLoggedin && (
              <li
                className={
                  router.pathname == "/addnewfood"
                    ? classes.active
                    : classes.notactive
                }
              >
                <Link href="/addnewfood">Add new food</Link>
              </li>
            )}
            {!isLoggedin && (
              <li
                className={
                  router.pathname == "/signin"
                    ? classes.active
                    : classes.notactive
                }
              >
                <Link href="/signin"> Sign in</Link>
              </li>
            )}
            {isLoggedin && (
              <li
                className={
                  router.pathname == "/myprofile"
                    ? classes.active
                    : classes.notactive
                }
              >
                <Link href="/myprofile">My Profile</Link>
              </li>
            )}
          </ul>
          <div className={classes.dropdown}>
            <button className={classes.dropbtn}>menu</button>
            <div className={classes.dropdowncontent}>
              <li
                className={
                  router.pathname == "/" ? classes.active : classes.notactive
                }
              >
                <Link href="/">Home</Link>
              </li>

              <li
                className={
                  router.pathname == "/foods"
                    ? classes.active
                    : classes.notactive
                }
              >
                <Link href="/foods">Foods</Link>
              </li>
              {isLoggedin && (
                <li
                  className={
                    router.pathname == "/addnewfood"
                      ? classes.active
                      : classes.notactive
                  }
                >
                  <Link href="/addnewfood">Add new food</Link>
                </li>
              )}
              {!isLoggedin && (
                <li
                  className={
                    router.pathname == "/signin"
                      ? classes.active
                      : classes.notactive
                  }
                >
                  <Link href="/signin"> Sign in</Link>
                </li>
              )}
              {isLoggedin && (
                <li
                  className={
                    router.pathname == "/myprofile"
                      ? classes.active
                      : classes.notactive
                  }
                >
                  <Link href="/myprofile">My Profile</Link>
                </li>
              )}
            </div>
          </div>
        </div>
      </section>

      {cartShown && <ShoppingCart />}
    </Fragment>
  );
};
export default Header;
