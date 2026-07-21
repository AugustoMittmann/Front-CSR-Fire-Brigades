'use client'

import Image from "next/image";
import styles from "./articleCard.module.css";

export default function ArticleCard({ article }) {
  return (
    <article className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={article.image}
          alt={article.title}
          width={350}
          height={180}
          className={styles.cardImage}
        />
        <span
          className={styles.categoryBadge}
          style={{ backgroundColor: article.categoryColor }}
        >
          {article.category}
        </span>
        <button className={styles.arrowButton} aria-label="Ver artigo completo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="#39542D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <div className={styles.contentContainer}>
        <h2 className={styles.title}>{article.title}</h2>
      </div>
      <p className={styles.description}>{article.description}</p>
    </article>
  );
}
