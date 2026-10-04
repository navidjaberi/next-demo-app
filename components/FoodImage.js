import Image from "next/image";
import { UtensilsCrossed } from "lucide-react";
import styles from "./FoodImage.module.css";

export default function FoodImage({ src, alt, sizes, eager = false }) {
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
      loading={eager ? "eager" : "lazy"}
      className={styles.image}
    />
  );
}
