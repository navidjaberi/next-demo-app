import { Fragment } from "react";
import classes from "../styles/index.module.css";
import Link from "next/link";

const Home = () => {
  return (
    <Fragment>
      <section className={classes.main}>
        <h1>Enjoy the best meal of your life!</h1>
        <div>
          <img src="https://images.hindustantimes.com/tech/img/2020/12/31/1600x900/pizza-3007395_1920_1609397294701_1609397310003.jpg"></img>
        </div>
        <Link href={"/foods"}>
          <button>Lets start!</button>
        </Link>
      </section>
    </Fragment>
  );
};

export default Home;
