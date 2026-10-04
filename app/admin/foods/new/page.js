import FoodForm from "@/components/FoodForm";
import { addFood } from "@/app/admin/actions";

export default function NewFoodPage() {
  return (
    <>
      <h2>Add a new food</h2>
      <FoodForm action={addFood} submitText="Add food" />
    </>
  );
}
