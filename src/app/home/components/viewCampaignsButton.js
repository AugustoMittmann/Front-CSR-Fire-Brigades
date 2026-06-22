import Icons from "../../constants/icons";
import Image from "next/image";
import styles from "./viewCampaigns.module.css";
import Link from "next/link";

export default function ViewCampaigns() {
  return (
    <Link href="/viewCampaignsPage">
        <div className={styles.button}>
            <div className={styles.content}
                 style={{marginLeft: "21px"}}>
                Conheça Nossas Campanhas
            </div>
            <div className={styles.icon}>
            <Image
                    src={Icons.prosseguir.value}
                    alt={Icons.prosseguir.alt}
                    height={21}
                    width={21}
                    />
            </div>
        </div>
    </Link>
  );
}