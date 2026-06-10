import styles from "./historiaPage.module.css";

export default function HistoriaPage() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>História da RNBV</h1>
        <p className={styles.paragraph}>
          A Rede Nacional de Brigadas Voluntárias (RNBV) reúne grupos
          espalhados pelo Brasil que atuam na prevenção e no combate a
          incêndios florestais. Esta página apresentará, em breve, a
          trajetória da rede, seus marcos e os pilares que conectam
          brigadistas voluntários em todo o país.
        </p>
        <p className={styles.paragraph}>
          Conteúdo em construção.
        </p>
      </div>
    </div>
  );
}
