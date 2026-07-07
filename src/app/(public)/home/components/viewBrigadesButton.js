import Icons from "../../../constants/icons";
import Image from "next/image";
import styles from "./viewBrigadesButton.module.css";
import Link from "next/link";

export default function ViewBrigades() {
  return (
    <Link href="/viewBrigadesPage">
        <div className={styles.button}>
            <div className={styles.icon}>
                <Image
                    src={Icons.localizacaobranco.value}
                    alt={Icons.localizacaobranco.alt}
                    height={21}
                    width={21}
                    />
            </div>
            <div className={styles.content}>
                Conheça Nossas Brigadas
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