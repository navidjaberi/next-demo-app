"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { ImagePlus } from "lucide-react";
import { addFood } from "@/app/foods/actions";
import { categories } from "@/lib/categories";
import styles from "./addFood.module.css";

export default function AddFoodForm() {
  const [state, formAction, isPending] = useActionState(addFood, {});
  const [preview, setPreview] = useState(null);
  const [imageError, setImageError] = useState("");
  const [lastState, setLastState] = useState(state);

  if (state !== lastState) {
    setLastState(state);
    setPreview(null);
  }

  const errors = state.errors || {};
  const values = state.values || {};

  function handleImageChange(event) {
    const file = event.target.files[0];
    setImageError("");

    if (!file) {
      setPreview(null);
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setImageError("Image should be smaller than 4MB.");
      setPreview(null);
      event.target.value = "";
      return;
    }

    setPreview(URL.createObjectURL(file));
  }

  return (
    <form action={formAction} className={`card form ${styles.form}`}>
      <div className={styles.row}>
        <div className="field">
          <label htmlFor="name">Name</label>
          <input
            className="input"
            id="name"
            name="name"
            defaultValue={values.name}
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
            defaultValue={values.category || ""}
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
            defaultValue={values.price}
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
          defaultValue={values.ingredients}
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
          defaultValue={values.description}
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
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>
        {(imageError || errors.image) && (
          <p className="field-error">{imageError || errors.image}</p>
        )}
      </div>

      {state.error && <p className="alert alert-error">{state.error}</p>}

      <button className="btn btn-primary btn-lg" type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Add food"}
      </button>
    </form>
  );
}
