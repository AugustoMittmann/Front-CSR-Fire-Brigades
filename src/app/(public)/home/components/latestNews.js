import Icons from "../../../constants/icons";
import Image from "next/image";
import styles from "./latestNews.module.css";
import Link from "next/link";

export default function LatestNews() {
  return (
    <Link href="/viewCampaignsPage?tipo=noticias">
        <div className={styles.button}>
            <div className={styles.content}
                 style={{marginLeft: "21px"}}>
                Acompanhe as Últimas Notícias
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