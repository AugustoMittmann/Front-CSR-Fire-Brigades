import Icons from "../../constants/icons";
import Image from "next/image";
import styles from "./contactButton.module.css";
import Link from "next/link";

export default function Contact() {
  return (
    <Link href="/contactPage">
        <div className={styles.button}>
            <div className={styles.icon}>
                <Image
                    src={Icons.mail.value}
                    alt={Icons.mail.alt}
                    height={21}
                    width={21}
                    />
            </div>
            <div className={styles.content}>
                Entrar em contato
            </div>
            <div className={styles.icon}>
            <Image
                    src={Icons.prosseguirbranco.value}
                    alt={Icons.prosseguirbranco.alt}
                    height={21}
                    width={21}
                    />
            </div>
        </div>
    </Link>
  );
}