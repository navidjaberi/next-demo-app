import { Fragment } from "react";
import { useEffect, useState } from "react";
import Card from "../../components/card";
import FoodItem from "../../components/foodItem";
import React from "react";
import classes from "../../styles/foods.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("foods")) {
      const foods = JSON.parse(localStorage.getItem("foods"));
      setFoods(foods);
    } else {
      fetchFoods();
    }
  }, []);

  async function fetchFoods() {
    setLoading(true);
    try {
      const response = await fetch(
        "https://nextapp-bf66b-default-rtdb.firebaseio.com/food.json"
      );
      if (!response.ok) {
        setErrorMsg("No item Found...");
        setError(true);
        setLoading(false);
      } else {
        const data = await response.json();
        setLoading(false);
        const loadedFoods = [];
        for (const key in data) {
          loadedFoods.push({
            key: key,
            id: key,
            image: data[key].Image,
            name: data[key].name,
            material: data[key].material,
            price: data[key].price,
          });
        }
        setFoods(loadedFoods);
        localStorage.setItem("foods", JSON.stringify(loadedFoods));
      }
    } catch (error) {
      setLoading(false);
      setErrorMsg("Network connection error");
      setError(true);
    }
  }
  return (
    <Card>
      <h1 style={{ color: "rgb(57, 9, 102)", textTransform: "uppercase" }}>
        Foods
      </h1>
      {loading && <p className={classes.load}> loading...</p>}
      {error && (
        <p>
          <FontAwesomeIcon
            icon={faXmark}
            style={{ color: "red" }}
          ></FontAwesomeIcon>{" "}
          {errorMsg}
        </p>
      )}
      {foods.map((food) => (
        <FoodItem
          key={food.id}
          image={food.image}
          name={food.name}
          material={food.material}
          price={food.price}
          id={food.id}
        />
      ))}
    </Card>
  );
};
const Foods = () => {
  return (
    <Fragment>
      <FoodList />
    </Fragment>
  );
};
export default Foods;
