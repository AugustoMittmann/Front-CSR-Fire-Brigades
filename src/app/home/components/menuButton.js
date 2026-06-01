import Icons from "../../constants/icons";
import Image from "next/image";
import styles from "./menuButton.module.css";

export default function MenuButton() {
  return (
    <button type="button" className={styles.borderRadius} aria-label="Abrir menu">
      <Image
        src={Icons.menu.value}
        alt=""
        height={20}
        width={20}
      />
    </button>
  );
}
