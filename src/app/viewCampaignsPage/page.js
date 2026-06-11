'use client'

import { useEffect, useState } from "react";
import ArticleCard from "./components/articleCard";
import styles from "./artigosPage.module.css";
import { api } from "@/lib/api";

// Cores do "category badge" — antes hardcoded no mock; agora aplicadas
// programaticamente conforme a categoria de cada item retornado pela API.
const CATEGORY_COLORS = {
  Campanha: "#1E88E5",
  "Boas Práticas": "#7CB342",
  Artigo: "#F9A825",
  Notícia: "#D32F2F",
};

const PLACEHOLDER_IMAGE = "/placeholder-brigade.svg";

/**
 * Junta campanhas + notícias + artigos numa única lista para a UI atual,
 * que mostra todos os tipos de publicação juntos. Cada origem vira uma
 * "category" coerente com o badge.
 */
const mergePublications = ({ campaigns, news, articles }) => {
  const items = [];

  for (const c of campaigns) {
    items.push({
      id: `campaign-${c.id}`,
      sortKey: c.publishedAt || c.createdAt,
      category: "Campanha",
      categoryColor: CATEGORY_COLORS.Campanha,
      title: c.title,
      description: c.description ?? "",
      image: c.imageUrl || PLACEHOLDER_IMAGE,
    });
  }
  for (const n of news) {
    items.push({
      id: `news-${n.id}`,
      sortKey: n.publishedAt || n.createdAt,
      category: "Notícia",
      categoryColor: CATEGORY_COLORS["Notícia"],
      title: n.title,
      description: n.summary || n.subtitle || "",
      image: n.imageUrl || PLACEHOLDER_IMAGE,
    });
  }
  for (const a of articles) {
    const cat = a.category === "Boas Práticas" ? "Boas Práticas" : "Artigo";
    items.push({
      id: `article-${a.id}`,
      sortKey: a.publishedAt || a.createdAt,
      category: cat,
      categoryColor: CATEGORY_COLORS[cat],
      title: a.title,
      description: a.summary || a.subtitle || "",
      image: a.imageUrl || PLACEHOLDER_IMAGE,
    });
  }

  // Mais recentes primeiro.
  items.sort((a, b) => (b.sortKey ?? "").localeCompare(a.sortKey ?? ""));
  return items;
};

export default function ArtigosPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [campaignsRes, newsRes, articlesRes] = await Promise.all([
          api.campaigns.list({ limit: 50 }, { signal: ctrl.signal }),
          api.news.list({ limit: 50 }, { signal: ctrl.signal }),
          api.articles.list({ limit: 50 }, { signal: ctrl.signal }),
        ]);
        setArticles(
          mergePublications({
            campaigns: campaignsRes?.data ?? [],
            news: newsRes?.data ?? [],
            articles: articlesRes?.data ?? [],
          }),
        );
      } catch (err) {
        if (err.name === "AbortError") return;
        // eslint-disable-next-line no-console
        console.error("[ArtigosPage] load failed", err);
        setError("Não foi possível carregar as publicações.");
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => ctrl.abort();
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.mainContent}>
        <div className={styles.titleContainer}>
          <h1 className={styles.pageTitle}>Campanhas</h1>
          <button className={styles.filterButton} aria-label="Filtrar campanhas">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z" fill="#39542D"/>
            </svg>
          </button>
        </div>

        {loading && <p>Carregando publicações...</p>}
        {error && <p style={{ color: "#C62828" }}>{error}</p>}
        {!loading && !error && articles.length === 0 && (
          <p>Nenhuma publicação disponível no momento.</p>
        )}

        <div className={styles.articlesContainer}>
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </main>
    </div>
  );
}
