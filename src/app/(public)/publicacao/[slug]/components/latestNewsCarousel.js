"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import styles from "./latestNewsCarousel.module.css";

/**
 * Carrossel "Últimas notícias" exibido ao final da página de detalhe.
 *
 * Mostra UMA notícia por vez (imagem + título + resumo) com setas de navegação
 * que dão a volta (wrap-around) e um botão "Saiba Mais" que abre o detalhe da
 * notícia atual. Se não houver notícias, o componente não renderiza nada.
 *
 * `excludeId` evita listar a própria notícia quando o detalhe aberto já é uma
 * notícia.
 */

const NEWS_LIMIT = 8;

const byMostRecent = (a, b) =>
  (Date.parse(b.publishedAt || b.createdAt) || 0) -
  (Date.parse(a.publishedAt || a.createdAt) || 0);

export default function LatestNewsCarousel({ excludeId = null }) {
  const [news, setNews] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const ctrl = new AbortController();
    const load = async () => {
      try {
        const res = await api.news.list({ limit: NEWS_LIMIT }, { signal: ctrl.signal });
        const items = (res?.data ?? [])
          .filter((n) => n.id !== excludeId)
          .sort(byMostRecent);
        setNews(items);
        setIndex(0);
      } catch (err) {
        if (err.name === "AbortError") return;
        // eslint-disable-next-line no-console
        console.error("[LatestNewsCarousel] load failed", err);
      }
    };
    load();
    return () => ctrl.abort();
  }, [excludeId]);

  if (!news.length) return null;

  const current = news[index];
  const multiple = news.length > 1;
  const prev = () => setIndex((i) => (i - 1 + news.length) % news.length);
  const next = () => setIndex((i) => (i + 1) % news.length);

  return (
    <section
      className={styles.section}
      aria-roledescription="carrossel"
      aria-label="Últimas notícias"
    >
      <h2 className={styles.heading}>Últimas notícias</h2>

      <div className={styles.carousel}>
        {multiple && (
          <button
            type="button"
            className={styles.navButton}
            onClick={prev}
            aria-label="Notícia anterior"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        <div className={styles.viewport}>
          <Link
            href={`/publicacao/news-${current.id}`}
            className={styles.cardLink}
            aria-label={`Abrir notícia: ${current.title}`}
          >
            <article className={styles.card}>
              {current.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className={styles.image}
                  src={current.imageUrl}
                  alt={current.title}
                />
              )}
              <h3 className={styles.cardTitle}>{current.title}</h3>
              <p className={styles.cardSummary}>
                {current.summary || current.subtitle || ""}
              </p>
            </article>
          </Link>
        </div>

        {multiple && (
          <button
            type="button"
            className={styles.navButton}
            onClick={next}
            aria-label="Próxima notícia"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      <Link href="/viewCampaignsPage?tipo=noticias" className={styles.saibaMais}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 8v8M8 12h8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        Saiba Mais
      </Link>
    </section>
  );
}
