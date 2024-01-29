import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import Card from "../../components/card";
import DetailItems from "../../components/detailItems";

const Detail = () => {
  const [foods, setFoods] = useState([]);
  const router = useRouter();
  const id = router.query.id;

  fetch(`https://nextapp-bf66b-default-rtdb.firebaseio.com/food.json`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const loadedFoods = [];
      console.log(data.id);
      for (const key in data) {
        if (key === id) {
          loadedFoods.push({
            key: key,
            id: key,
            image: data[key].Image,
            name: data[key].name,

            description: data[key].description,
          });
        }
        setFoods(loadedFoods);
      }
    });
  return (
    <Fragment>
      <Card>
        {foods.map((food) => (
          <DetailItems
            key={food.id}
            image={food.image}
            name={food.name}
            id={food.id}
            description={food.description}
          />
        ))}
      </Card>
    </Fragment>
  );
};
export default Detail;
