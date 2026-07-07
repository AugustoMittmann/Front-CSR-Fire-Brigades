import styles from "./demographicCensus.module.css";

const CENSUS_FORM_URL = "https://form.jotform.com/211837780172054";

export default function DemographicCensus() {
  return (
      <a href={CENSUS_FORM_URL} target="_blank" rel="noopener noreferrer">
        <div className={styles.button}>
            <div className={styles.content}>
                Preencher o Censo Demográfico
            </div>
        </div>
    </a>
  );
}
