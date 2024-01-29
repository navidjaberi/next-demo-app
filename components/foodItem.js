import { useRouter } from "next/router";
import { Fragment, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthContex from "../store/authContex";
import { cartItemsActions } from "../store/cartItems";
import classes from "../styles/foods.module.css";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import FavContex from "../store/favoriteContex";

const FoodItem = (props) => {
  const Authctx = useContext(AuthContex);
  const favCtx = useContext(FavContex);
  const isLoggedin = Authctx.isLoggedin;
  const isFavorite = favCtx.itemIsfav(props.id);
  const router = useRouter();
  const priceNum = +props.price;
  const price = `$${priceNum.toFixed(2)}`;
  const dispath = useDispatch();
  const favHandler = () => {
    if (isFavorite) {
      favCtx.removeFromFavorites(props.id);
      localStorage.removeItem("fav");
    } else {
      favCtx.addToFavorites({
        id: props.id,
        image: props.image,
        name: props.name,
        material: props.material,
      });
      localStorage.setItem("fav", JSON.stringify({
        id: props.id,
        image: props.image,
        name: props.name,
        material: props.material,
      }));
    }
  };
  const addCartHandler = () => {
    dispath(
      cartItemsActions.addItemToCart({
        id: props.id,
        name: props.name,
        price: priceNum,
      })
    );
  };
  const detailHandler = () => {
    router.push("/foods/" + props.id);
  };
  return (
    <Fragment>
      <section className={classes.carditem}>
        <div>
          <img src={props.image} />
        </div>

        <h2>{props.name} </h2>
        <p>({props.material})</p>
        <p className={classes.price}>{price}</p>
        {isLoggedin && (
          <FontAwesomeIcon
            icon={faHeart}
            title={isFavorite ? "added to favotite" : "add to favorite"}
            beat={!isFavorite}
            className={
              !isFavorite
                ? `${classes.favicon} ${classes.notfav}`
                : `${classes.favicon} ${classes.fav}`
            }
            onClick={favHandler}
          />
        )}
        <div>
          <button
            onClick={addCartHandler}
            disabled={!isLoggedin}
            title={isLoggedin ? "add to Cart" : "please login to order foods"}
          >
            Add to Cart
          </button>
          <button onClick={detailHandler}> Detail</button>
        </div>
      </section>
    </Fragment>
  );
};
export default FoodItem;
