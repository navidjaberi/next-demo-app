import React, { useEffect, useState } from "react";

const FavContex = React.createContext({
  favorites: [],
  totalFav:0,
  addToFavorites: (favMeal) => {},
  removeFromFavorites: (mealId) => {},
  itemIsfav: (mealId) => {},
});

export function FavContexProvider(props) {
  const [isfav, setIsfav] = useState([]);



  const addToFavoritesHandler = (favMeal) => {
 
    setIsfav((preFav) => {
      
      return preFav.concat(favMeal);
    });
  };
  const removeFromFavoritesHandler = (mealId) => {

    setIsfav((preFav) => {
      return preFav.filter((meal) => meal.id !== mealId);
    });
  };
  const itemIsfavHandler = (mealId) => {
    return isfav.some((meal) => meal.id === mealId);
  };

  const value = {
    favorites: isfav,
    totalFav:isfav.length,
      addToFavorites:addToFavoritesHandler,
      removeFromFavorites:removeFromFavoritesHandler,
      itemIsfav:itemIsfavHandler,
  };

  return (
    <FavContex.Provider value={value}>{props.children}</FavContex.Provider>
  );
}
export default FavContex;
