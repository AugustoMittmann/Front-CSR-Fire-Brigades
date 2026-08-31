'use client'

import Image from "next/image";
import Link from "next/link";
import styles from "./articleCard.module.css";

export default function ArticleCard({ article }) {
  return (
    <Link
      href={`/publicacao/${article.id}`}
      aria-label={`Abrir: ${article.title}`}
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
    >
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
          <span className={styles.arrowButton} aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="#39542D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
        <div className={styles.contentContainer}>
          <h2 className={styles.title}>{article.title}</h2>
        </div>
        <p className={styles.description}>{article.description}</p>
      </article>
    </Link>
  );
}
