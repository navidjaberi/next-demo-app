import Image from "next/image";
import styles from "./Avatar.module.css";

export default function Avatar({ src, name, size = 36 }) {
  const firstLetter = name ? name[0].toUpperCase() : "?";

  return (
    <span className={styles.avatar} style={{ width: size, height: size }}>
      {src ? (
        <Image src={src} alt={name || "Avatar"} fill sizes={`${size}px`} className={styles.image} />
      ) : (
        <span style={{ fontSize: size * 0.45 }}>{firstLetter}</span>
      )}
    </span>
  );
}
