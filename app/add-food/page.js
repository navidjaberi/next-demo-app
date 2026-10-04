import FoodForm from "@/components/FoodForm";
import { addFood } from "@/app/foods/actions";

export const metadata = {
  title: "Add food",
};

export default function AddFoodPage() {
  return (
    <>
      <h1 className="page-title">Add a new food</h1>
      <p className="page-subtitle">Share a new dish with everyone on the menu.</p>
      <FoodForm action={addFood} submitText="Add food" />
    </>
  );
}
