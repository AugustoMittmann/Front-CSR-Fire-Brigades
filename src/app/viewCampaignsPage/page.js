'use client'

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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

const LOADING_TEXT = "Carregando publicações...";

/**
 * Junta campanhas + notícias + artigos numa única lista para a UI. As fontes
 * não buscadas no modo atual chegam como arrays vazios, então o mesmo caminho
 * de merge/ordenação é reutilizado em todos os modos.
 */
const mergePublications = ({ campaigns = [], news = [], articles = [] }) => {
  const items = [];

  campaigns.forEach(campaign => items.push(makeCampaign(campaign)));
  news.forEach(n => items.push(makeNews(n)));
  articles.forEach(a => {
    const cat = a.category === "Boas Práticas" ? "Boas Práticas" : "Artigo";
    items.push(makeArticle(a, cat));
  });

  return items.toSorted(byMostRecent());
};

const makeCampaign = (c) => {
  return {
    id: `campaign-${c.id}`,
    sortKey: c.publishedAt || c.createdAt,
    category: "Campanha",
    categoryColor: CATEGORY_COLORS.Campanha,
    title: c.title,
    description: c.description ?? "",
    image: c.imageUrl || PLACEHOLDER_IMAGE,
  };
};

const makeNews = (n) => {
  return {
    id: `news-${n.id}`,
    sortKey: n.publishedAt || n.createdAt,
    category: "Notícia",
    categoryColor: CATEGORY_COLORS["Notícia"],
    title: n.title,
    description: n.summary || n.subtitle || "",
    image: n.imageUrl || PLACEHOLDER_IMAGE,
  };
};

const makeArticle = (a, cat) => {
  return {
    id: `article-${a.id}`,
    sortKey: a.publishedAt || a.createdAt,
    category: cat,
    categoryColor: CATEGORY_COLORS[cat],
    title: a.title,
    description: a.summary || a.subtitle || "",
    image: a.imageUrl || PLACEHOLDER_IMAGE,
  };
};

const byMostRecent = () => {
  return (a, b) => (b.sortKey ?? "").localeCompare(a.sortKey ?? "");
};

// Fonte única da verdade por modo: título, rótulo do filtro e quais fontes
// buscar. Adicionar um modo novo é uma entrada só, sem espalhar condicionais.
const VIEW_CONFIG = {
  campanhas: {
    title: "Campanhas",
    filterLabel: "Filtrar campanhas",
    sources: ["campaigns"],
  },
  noticias: {
    title: "Notícias",
    filterLabel: "Filtrar notícias",
    sources: ["news"],
  },
  all: {
    title: "Publicações",
    filterLabel: "Filtrar publicações",
    sources: ["campaigns", "news", "articles"],
  },
};

const normalizeTipo = (raw) =>
  raw === "campanhas" || raw === "noticias" ? raw : "all";

// Busca só as fontes do modo atual e devolve as demais como arrays vazios,
// mantendo a chamada de mergePublications uniforme.
const loadSources = async (sources, signal) => {
  const result = { campaigns: [], news: [], articles: [] };
  await Promise.all(
    sources.map(async (source) => {
      const res = await api[source].list({ limit: 50 }, { signal });
      result[source] = res?.data ?? [];
    }),
  );
  return result;
};

function ViewCampaignsContent() {
  const tipo = normalizeTipo(useSearchParams().get("tipo"));
  const view = VIEW_CONFIG[tipo];

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const sources = await loadSources(view.sources, ctrl.signal);
        setArticles(mergePublications(sources));
      } catch (err) {
        if (err.name === "AbortError") return;
        // eslint-disable-next-line no-console
        console.error("[ViewCampaignsPage] load failed", err);
        setError("Não foi possível carregar as publicações.");
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => ctrl.abort();
  }, [tipo]);

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.mainContent}>
        <div className={styles.titleContainer}>
          <h1 className={styles.pageTitle}>{view.title}</h1>
          <button className={styles.filterButton} aria-label={view.filterLabel}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z" fill="#39542D"/>
            </svg>
          </button>
        </div>

        {loading && <p>{LOADING_TEXT}</p>}
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

export default function ViewCampaignsPage() {
  return (
    <Suspense fallback={<p>{LOADING_TEXT}</p>}>
      <ViewCampaignsContent />
    </Suspense>
  );
}
