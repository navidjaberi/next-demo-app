import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Card from "../../components/card";
import DetailItems from "../../components/detailItems";
import { createClient } from "../lib/supabase/client";

const Detail = () => {
  const [food, setFood] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    if (!id) return;

    const fetchFood = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("food")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setFood(data);
    };

    fetchFood();
  }, [id]);

  return (
    <Fragment>
      <Card>
        {food && (
          <DetailItems
            id={food.id}
            image={food.image}
            name={food.name}
            description={food.description}
          />
        )}
      </Card>
    </Fragment>
  );
};

export default Detail;
