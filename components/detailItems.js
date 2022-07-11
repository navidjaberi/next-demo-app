import { useRouter } from "next/router";
import { Fragment } from "react";
import classes from "../styles/foods.module.css";

const DetailItems = (props) => {
  const router = useRouter();
  const backHandler = () => {
    router.back("/foods");
  };
  return (
    <Fragment>
      <section className={classes.carditem}>
        <div>
          <img src={props.image} />
        </div>
        <h2>{props.name}</h2>
        <p>{props.description}</p>

        <div>
          <button onClick={backHandler}>Back</button>
        </div>
      </section>
    </Fragment>
  );
};
export default DetailItems;
