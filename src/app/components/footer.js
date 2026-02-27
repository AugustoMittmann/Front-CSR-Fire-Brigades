import styles from "./footer.module.css";
import Image from "next/image";
import Icons from "../constants/icons";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
      <footer className={styles.footer}>
        <div className={styles.imageContainer}>
          <Image
            src="/images/juntos_somos_mais_fortes.jpg"
            alt="Juntos somos mais fortes - RNBV"
            fill
          />
        </div>

        <div className={styles.contentContainer}>
          <p className={styles.description}>
            A expressão "Juntos somos mais fortes" é perfeita para a realidade das
            Brigadas Voluntárias e para demonstrar a nossa força é preciso que a
            sua organização faça parte deste esforço.
          </p>

          <div className={styles.linksContainer}>
            <a href="https://www.instagram.com/brigadasvoluntarias/" target="_blank" rel="noopener noreferrer" className={styles.link}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#bc6c25">
                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
              </svg>
              Acesse o nosso Instagram
            </a>

            <a href="/FAQPage" className={styles.link}>
              <Image
                  src={Icons.ajuda.value}
                  alt={Icons.ajuda.alt}
                  height={24}
                  width={24}
                />
              Dúvidas Frequentes
            </a>
          </div>

          <div className={styles.copyright}>
            © {currentYear} RNBV - Rede Nacional de Brigadas Voluntárias
          </div>
        </div>
      </footer>
    );
  }
