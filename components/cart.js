import classes from "../styles/shoppingCart.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMultiply } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { cartItemsActions } from "../store/cartItems";
const Cart = (props) => {
  const { title, amount, total, totalPrice, id, price } = props.item;
  const priceNum = +totalPrice;

  const priceSt = `$${priceNum.toFixed(2)}`;
  const dispath = useDispatch();

  const addCartHandler = () => {
    dispath(
      cartItemsActions.addItemToCart({
        id: id,
        total: total,
        price: price,
        amount: amount,
      })
    );
  };
  const removeCartHandler = () => {
    dispath(
      cartItemsActions.removeFromCart({
        id: id,
        price: price,
        amount: amount,
      })
    );
  };
  return (
    <section className={classes.items}>
      <div>
        <span>{title}</span>
        <span>
          {" "}
          <FontAwesomeIcon
            icon={faMultiply}
            style={{ margin: "-2px 0 -2px 9px" }}
          />{" "}
          {amount}
        </span>
      </div>
      <div>
        <span className={classes.action}>
          <button onClick={addCartHandler}>+</button>
          <button onClick={removeCartHandler}>-</button>
        </span>
        <span>{priceSt}</span>
      </div>
    </section>
  );
};
export default Cart;
