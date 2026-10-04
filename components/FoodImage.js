import Image from "next/image";
import { UtensilsCrossed } from "lucide-react";
import styles from "./FoodImage.module.css";

export default function FoodImage({ src, alt, sizes, priority = false }) {
  if (!src) {
    return (
      <div className={styles.placeholder}>
        <UtensilsCrossed size={40} />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={styles.image}
    />
  );
}
