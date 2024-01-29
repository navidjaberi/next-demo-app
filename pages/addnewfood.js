import { Fragment, useContext, useEffect, useRef, useState } from "react";
import classes from "../styles/addnewfood.module.css";
import spiner from "../styles/spiner.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import AuthContex from "../store/authContex";
import Link from "next/link";
import { useRouter } from "next/router";
import Home from ".";
const AddNewFood = () => {
  const [error, setError] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);
  const [entredNameValid, setEntredNameValid] = useState(true);
  const [entredMaterialValid, setEntredMaterialValid] = useState(true);
  const [entredDesValid, setEntredDesValid] = useState(true);
  const [entredPriceeValid, setEntredPriceValid] = useState(true);
  const [baseImg, setBaseImg] = useState("");
  const [entredimg, setentredImg] = useState(true);
  const nameref = useRef();
  const materialRef = useRef();
  const desref = useRef();
  const priceref = useRef();
  const router = useRouter();
  const Authctx = useContext(AuthContex);
  const loggedin = Authctx.isLoggedin;
  useEffect(() => {
    if (!loggedin) {
      router.push("/");
    }
  }, []);
  if (!loggedin) {
    return (
      <Link href="/">
        <Home />
      </Link>
    );
  }

  const imgHandler = async (e, img) => {
    if (!img) {
      setentredImg(false);
    }
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    setBaseImg(base64);
  };
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  const changeHandler = () => {
    setEntredNameValid(true);
    setEntredPriceValid(true);
    setEntredMaterialValid(true);
    setEntredDesValid(true);
  };
  async function addNewFoodHandler(e) {
    const enteredName = nameref.current.value;
    e.preventDefault();
    if (enteredName.trim() === "") {
      setEntredNameValid(false);
      return;
    }
    const enteredMaterial = materialRef.current.value;
    if (enteredMaterial.length < 10) {
      setEntredMaterialValid(false);
      return;
    }
    const enteredDes = desref.current.value;
    if (enteredDes.length < 15) {
      setEntredDesValid(false);
      return;
    }
    const enteredPrice = priceref.current.value;
    const entredPriceValidation = enteredPrice.trim() === "" || !+enteredPrice;
    if (entredPriceValidation) {
      setEntredPriceValid(false);
      return;
    }
    if (entredimg) {
      alert("plaese select an image first!");
      return;
    }
    if (
      enteredName.trim() === "" ||
      enteredMaterial < 10 ||
      enteredDes.length < 15 ||
      entredPriceValidation
    ) {
      setError(true);
      setSuccessful(false);
      setLoading(false);
    }

    setLoading(true);
    try {
      setError(false);
      const response = await fetch(
        "https://nextapp-bf66b-default-rtdb.firebaseio.com/food.json",
        {
          method: "POST",
          body: JSON.stringify({
            name: enteredName,
            material: enteredMaterial,
            description: enteredDes,
            price: enteredPrice,
            Image: baseImg,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        setSuccessful(false);
        setError(true);
        setLoading(false);
        setTimeout(() => {
          setError(false);
        }, 3000);
      } else {
        const data = await response.json();
        setSuccessful(true);
        setTimeout(() => {
          setSuccessful(false);
        }, 3000);
        setError(false);
        setLoading(false);
        console.log(data);
        localStorage.removeItem('foods')
      }
    } catch (err) {
      setError(true);
      setLoading(false);
    }
    nameref.current.value = "";
    materialRef.current.value = "";
    desref.current.value = "";
    priceref.current.value = "";

    setEntredNameValid(true);
    setEntredMaterialValid(true);
    setEntredPriceValid(true);
    setEntredDesValid(true);
  }

  return (
    <Fragment>
      <div className={classes.form}>
        <h1>Add New Food</h1>
        <form onSubmit={addNewFoodHandler}>
          <div className={classes.control}>
            <label htmlFor="name">Enter food's Name</label>
            <input
              className={
                !entredNameValid ? `${classes.invalid} ` : `${classes.valid}`
              }
              type="Text"
              id="name"
              ref={nameref}
              onChange={changeHandler}
            ></input>
            {!entredNameValid && (
              <p className={classes.error}>Please fill the empty field</p>
            )}
          </div>
          <div className={classes.control}>
            <label htmlFor="material"> Enter food's Material</label>
            <textarea
              className={
                !entredDesValid ? `${classes.invalid} ` : `${classes.valid}`
              }
              cols="33"
              rows="3"
              id="material"
              ref={materialRef}
              onChange={changeHandler}
            ></textarea>
            {!entredMaterialValid && (
              <p className={classes.error}>Please write a longer material</p>
            )}
          </div>
          <div className={classes.control}>
            <label htmlFor="des">Enter food's Description</label>
            <textarea
              className={
                !entredDesValid ? `${classes.invalid} ` : `${classes.valid}`
              }
              cols="33"
              rows="4"
              id="des"
              ref={desref}
              onChange={changeHandler}
            ></textarea>
            {!entredDesValid && (
              <p className={classes.error}>Please write a longer description</p>
            )}
          </div>
          <div className={classes.control}>
            <label htmlFor="price">Enter foods's Price</label>
            <input
              className={
                !entredDesValid ? `${classes.invalid} ` : `${classes.valid}`
              }
              type="text"
              id="price"
              ref={priceref}
              onChange={changeHandler}
            ></input>
            {!entredPriceeValid && (
              <p className={classes.error}>Please input a wirte price</p>
            )}
          </div>
          <div className={`${classes.control} ${classes.img_label}`}>
            <label htmlFor="img">
              Select an image
              <FontAwesomeIcon
                icon={faUpload}
                style={{ marginLeft: "0.5rem" }}
              />
              <input type="file" id="img" onChange={imgHandler}></input>
            </label>
          </div>
          <button onClick={addNewFoodHandler}>Add Food</button>
          {error && <p className={classes.error}>Add New Food went Wrong!</p>}
          {successful && (
            <p className={classes.success}>New food successfully added!</p>
          )}
          <div style={{height:"3rem"}}>
          {loading && <p className={spiner.loader}>sending...</p>}
          </div>
         
        </form>
      </div>
    </Fragment>
  );
};
export default AddNewFood;
