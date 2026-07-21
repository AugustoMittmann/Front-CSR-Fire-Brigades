import styles from "./contactCTAButton.module.css";
import Link from "next/link";

export default function ContactCTAButton() {
  return (
    <Link href="/contactPage" className={styles.link}>
        <div className={styles.button}>
            <div className={styles.content}>
                Entre em Contato
            </div>
        </div>
    </Link>
  );
}
