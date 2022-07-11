import { useContext } from "react";
import FavContex from "../store/favoriteContex";
const FavotiteItem = (props) => {
  const FavCtx = useContext(FavContex);
  const removeFav = () => {
    FavCtx.removeFromFavorites(props.id);
    localStorage.removeItem("fav");
  };
  return (
    <section>
      <div>
        <img src={props.image} />
      </div>

      <h2>{props.name} </h2>
      <p>({props.material})</p>

      <div>
        <button onClick={removeFav}>Remove form Favorite</button>
      </div>
    </section>
  );
};
export default FavotiteItem;
