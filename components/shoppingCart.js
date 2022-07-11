import Modal from "./modal";
import classes from "../styles/shoppingCart.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMultiply } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { cartShownActions } from "../store/cartShown";
import Cart from "./cart";

const ShoppingCart = () => {
  const dispath = useDispatch();
  const cartCloseHandler = () => {
    dispath(cartShownActions.toggle());
  };
  const cartitems = useSelector((state) => state.cartItems.items);

  const total = useSelector((state) => state.cartItems.total);
  const priceNum = +total;

  const orderPrice = `$${priceNum.toFixed(2)}`;
  return (
    <Modal>
      <div>
        {" "}
        <FontAwesomeIcon
          onClick={cartCloseHandler}
          icon={faMultiply}
          style={{
            margin: "-2px 0 -2px 9px",
            float: "right",
            fontSize: "23px",
            cursor: "pointer",
          }}
        />
      </div>
      <div className={classes.shoppingCart}>
        <h1>Items</h1>
        <h1>Price</h1>
      </div>

      {cartitems.map((food) => (
        <Cart
          key={food.id}
          item={{
            id: food.id,
            title: food.name,
            totalPrice: food.totalPrice,
            amount: food.amount,
            price: food.price,
          }}
        />
      ))}
      <div className={classes.shoppingCart}>
        <h2>Total:</h2>

        <h2>{orderPrice}</h2>
      </div>
      <div className={classes.orderAction}>
        <button>Order</button>
        <button onClick={cartCloseHandler}>Discard</button>
      </div>
    </Modal>
  );
};
export default ShoppingCart;
