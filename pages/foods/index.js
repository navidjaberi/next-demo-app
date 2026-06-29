import { Fragment } from "react";
import { useEffect, useState } from "react";
import Card from "../../components/card";
import FoodItem from "../../components/foodItem";
import React from "react";
import classes from "../../styles/foods.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../../lib/supabase/client";
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
      const { data, error } = await supabase.from("food").select("*");
      if (error) {
        throw error;
      }
      setFoods(data);
      localStorage.setItem("foods", JSON.stringify(data));
    } catch (err) {
      setError(true);
      setErrorMsg(err.message || "Network connection error");
    } finally {
      setLoading(false);
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
