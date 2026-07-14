import Icons from "../../constants/icons";
import Image from "next/image";
import styles from "./redirectButton.module.css";
import Link from "next/link";

export default function RedirectButton({ link, label, icon, variation = "orange" }) {
  const selectedIcon = icon ? Icons[icon] : null;
  const chevronIcon = variation === "white" ? Icons.prosseguir : Icons.prosseguirbranco;

  const button = (
    <div className={`${styles.button} ${styles[variation]}`}>
      {selectedIcon && (
        <div className={styles.icon}>
          <Image
            src={selectedIcon.value}
            alt={selectedIcon.alt}
            height={21}
            width={21}
          />
        </div>
      )}
      <div className={`${styles.content} ${!selectedIcon ? styles.noIcon : ""}`}>{label}</div>
      <div className={styles.icon}>
        <Image
          src={chevronIcon.value}
          alt={chevronIcon.alt}
          height={21}
          width={21}
        />
      </div>
    </div>
  );

  if (link) {
    return <Link href={link}>{button}</Link>;
  }

  return button;
}