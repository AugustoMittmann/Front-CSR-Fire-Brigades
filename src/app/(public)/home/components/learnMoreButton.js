import Icons from "../../../constants/icons";
import Image from "next/image";
import styles from "./learnMoreButton.module.css";
import Link from "next/link";

export default function LearnMoreButton() {
  return (
    <Link href="/viewCampaignsPage">
      <div className={styles.button}>
        <div className={styles.icon}>
          <Image
            src={Icons.mais.value}
            alt={Icons.mais.alt}
            height={24}
            width={24}
          />
        </div>
        <div className={styles.content}>Saiba Mais</div>
      </div>
    </Link>
  );
}
