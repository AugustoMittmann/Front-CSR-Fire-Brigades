import RedirectButton from "../../components/redirectButton";
import styles from "./homepage.module.css";
import DemographicCensus from "./components/demographicCensus";
import CampaignsCarousel from "./components/campaignsCarousel";
import LearnMoreButton from "./components/learnMoreButton";
import HomeStats from "./components/homeStats";

function Home() {
  return (
    <div className={styles.wrapper}>
      <section className={styles.firstSection}>
        <div className={styles.brigadasTitleWhite}>
          CONECTANDO BRIGADAS POR TODO O BRASIL
        </div>
        <div>
          <RedirectButton
            link="/viewCampaignsPage?tipo=campanhas"
            label="Conheça Nossas Campanhas"
            variation="white"
          />
        </div>
        <div>
          <RedirectButton
            link="/viewCampaignsPage?tipo=noticias"
            label="Acompanhe as Últimas Notícias"
            variation="white"
          />
        </div>
      </section>
      <section className={styles.campaignsSection}>
        <div className={styles.brigadasTitle}>
          Descubra Nossas Campanhas
        </div>
        <div>
          Encontre aqui as publicações das campanhas da RBNV pelo Brasil.
        </div>
        <CampaignsCarousel />
        <LearnMoreButton />
      </section>   
      
      <section className={styles.section}>
        <div className={styles.brigadasTitle}>
          Conheça nossas brigadas
        </div>
        <div>
          Encontre as brigadas mais próximas de você ou cadastre a sua brigada.
        </div>    
        <HomeStats />

        <div>
          <RedirectButton
            link="/viewBrigadesPage"
            label="Conheça Nossas Brigadas"
            icon="localizacaobranco"
          />
        </div>
        <div>
             <RedirectButton
            link="/contactPage"
            label="Entrar em contato"
            icon="mail"
          />
        </div>       
      </section>  
          
      <section className={styles.footerSection}>
        <div className={styles.footerTitle}>
          Conecte-se com a RNBV!
        </div>
        <div className={styles.footerText}>
          Contribua com as informações da sua brigada voluntária! 
          O Brasil precisa saber quantos somos e quantos grupos 
          não governamentais que atuam na prevenção 
          e combate ao fogo existem.
        </div>
        <div>
          <DemographicCensus/>
        </div>
      </section>
    </div>
  );
}

export default Home
