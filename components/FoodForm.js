"use client";

import { useActionState, useState, useTransition } from "react";
import Image from "next/image";
import { ImagePlus } from "lucide-react";
import { categories } from "@/lib/categories";
import styles from "./FoodForm.module.css";

const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

export default function FoodForm({ action, food, submitText }) {
  const [state, formAction, isPending] = useActionState(action, {});
  const [, startTransition] = useTransition();
  const [values, setValues] = useState({
    name: food?.name || "",
    category: food?.category || "",
    price: food?.price || "",
    ingredients: food?.ingredients || "",
    description: food?.description || "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(food?.image_url || null);
  const [imageError, setImageError] = useState("");

  const errors = state.errors || {};

  function handleChange(event) {
    setValues({ ...values, [event.target.name]: event.target.value });
  }

  function handleImageChange(event) {
    const file = event.target.files[0];
    setImageError("");

    if (!file) {
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("Image should be smaller than 4MB.");
      event.target.value = "";
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!image && !food) {
      setImageError("Please choose an image.");
      return;
    }

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, value));
    if (image) {
      formData.append("image", image);
    }

    startTransition(() => formAction(formData));
  }

  return (
    <form onSubmit={handleSubmit} className={`card form ${styles.form}`}>
      <div className={styles.row}>
        <div className="field">
          <label htmlFor="name">Name</label>
          <input
            className="input"
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            minLength={2}
            required
          />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>

        <div className="field">
          <label htmlFor="category">Category</label>
          <select
            className="input"
            id="category"
            name="category"
            value={values.category}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Choose a category
            </option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && <p className="field-error">{errors.category}</p>}
        </div>

        <div className="field">
          <label htmlFor="price">Price ($)</label>
          <input
            className="input"
            type="number"
            id="price"
            name="price"
            min="0.5"
            step="0.01"
            value={values.price}
            onChange={handleChange}
            required
          />
          {errors.price && <p className="field-error">{errors.price}</p>}
        </div>
      </div>

      <div className="field">
        <label htmlFor="ingredients">Ingredients</label>
        <input
          className="input"
          id="ingredients"
          name="ingredients"
          placeholder="Tomato, cheese, basil..."
          value={values.ingredients}
          onChange={handleChange}
          minLength={5}
          required
        />
        {errors.ingredients && <p className="field-error">{errors.ingredients}</p>}
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea
          className="input"
          id="description"
          name="description"
          rows={4}
          value={values.description}
          onChange={handleChange}
          minLength={15}
          required
        />
        {errors.description && <p className="field-error">{errors.description}</p>}
      </div>

      <div className="field">
        <label htmlFor="image">Image</label>
        <div className={styles.upload}>
          {preview ? (
            <Image src={preview} alt="Preview" fill className={styles.preview} unoptimized />
          ) : (
            <>
              <ImagePlus size={32} />
              <span>Click to choose an image (max 4MB)</span>
            </>
          )}
          <input
            className={styles.fileInput}
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        {(imageError || errors.image) && (
          <p className="field-error">{imageError || errors.image}</p>
        )}
      </div>

      {state.error && <p className="alert alert-error">{state.error}</p>}

      <button className="btn btn-primary btn-lg" type="submit" disabled={isPending}>
        {isPending ? "Saving..." : submitText}
      </button>
    </form>
  );
}
