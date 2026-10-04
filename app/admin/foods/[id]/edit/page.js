import { notFound } from "next/navigation";
import FoodForm from "@/components/FoodForm";
import { updateFood } from "@/app/admin/actions";
import { getFood } from "@/lib/foods";

export default async function EditFoodPage({ params }) {
  const { id } = await params;
  const food = await getFood(id);

  if (!food) {
    notFound();
  }

  return (
    <>
      <h2>Edit {food.name}</h2>
      <FoodForm action={updateFood.bind(null, food.id)} food={food} submitText="Save changes" />
    </>
  );
}
