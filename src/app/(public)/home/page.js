import ViewBrigades from "./components/viewBrigadesButton";
import styles from "./homepage.module.css";
import ViewCampaigns from "./components/viewCampaignsButton";
import LatestNews from "./components/latestNews";
import DemographicCensus from "./components/demographicCensus";
import Contact from "./components/contactButton";
import CampaignsCarousel from "./components/campaignsCarousel";
import LearnMoreButton from "./components/learnMoreButton";

function Home() {
  return (
    <div className={styles.wrapper}>
      <section className={styles.firstSection}>
        <div className={styles.brigadasTitleWhite}>
          CONECTANDO BRIGADAS POR TODO O BRASIL
        </div>
        <div>
          <ViewCampaigns />
        </div>
        <div>
          <LatestNews/>
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
        <div className={styles.statsContainer}>
          <div className={styles.statBlock}>
            <div className={styles.statNumber}>15</div>
            <div className={styles.statLabel}>Organizações</div>
          </div>
          <div className={styles.statBlock}>
            <div className={styles.statNumber}>932</div>
            <div className={styles.statLabel}>Brigadistas</div>
          </div>
          <div className={styles.statBlock}>
            <div className={styles.statNumber}>8</div>
            <div className={styles.statLabel}>Estados pelo Brasil</div>
          </div>
        </div>

        <div>
          <ViewBrigades />
        </div>
        <div>
          <Contact />
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
