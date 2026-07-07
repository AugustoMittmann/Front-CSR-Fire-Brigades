import Link from "next/link";
import styles from "./demographicCensus.module.css";

// The /viewCensusPage destination doesn't exist yet, so the button is rendered
// disabled and aria-disabled. Re-enable by wrapping the inner element in a
// <Link href="/viewCensusPage"> once the route ships.
export default function DemographicCensus() {
  return (
      <Link href="/viewCensusPage">
        <div className={styles.button}>
            <div className={styles.content}>
                Preencher o Censo Demográfico
            </div>
        </div>
    </Link>
  );
}
