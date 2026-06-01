import FAQ from './components/FAQ'
import ContactCTAButton from './components/contactCTAButton';
import styles from "./FAQpage.module.css";

function FAQPage() {

    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <h1 className={styles.title}>Dúvidas Frequentes</h1>
          <FAQ />
          <div className={styles.cta}>
            <p className={styles.ctaHelper}>Não encontrou o que precisava?</p>
            <ContactCTAButton />
          </div>
        </div>
      </div>
    );
  }

  export default FAQPage
