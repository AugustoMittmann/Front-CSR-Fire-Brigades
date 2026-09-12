'use client'

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ArticleCard from "./components/articleCard";
import PublicationsFilter from "./components/publicationsFilter";
import styles from "./artigosPage.module.css";
import { api } from "@/lib/api";

const CATEGORY_COLORS = {
  Campanha: "#1E88E5",
  "Boas Práticas": "#7CB342",
  Artigo: "#F9A825",
  Notícia: "#D32F2F",
};

const PLACEHOLDER_IMAGE = "/placeholder-brigade.svg";

const LOADING_TEXT = "Carregando publicações...";

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

// Ordem canônica das categorias para derivar as opções do filtro.
const CATEGORY_ORDER = ["Campanha", "Boas Práticas", "Artigo", "Notícia"];

// Comparador por data: "recent" = mais recentes primeiro, "oldest" = inverso.
const sortByDate = (order) => (a, b) => {
  const recentFirst = (b.sortKey ?? "").localeCompare(a.sortKey ?? "");
  return order === "oldest" ? -recentFirst : recentFirst;
};

const PAGE_TITLE = "Publicações";
const FILTER_LABEL = "Filtrar publicações";

// A página sempre carrega todas as publicações; o botão de entrada (tipo) só
// PRÉ-MARCA categorias no filtro, então dá pra ajustar sem trocar de página.
const ALL_SOURCES = ["campaigns", "news", "articles"];

const TIPO_PRESELECT = {
  campanhas: ["Campanha"],
  noticias: ["Notícia"],
  artigos: ["Artigo", "Notícia"],
  all: [],
};

const normalizeTipo = (raw) =>
  raw === "campanhas" || raw === "noticias" || raw === "artigos" ? raw : "all";

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

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(TIPO_PRESELECT[tipo]);
  const [sortOrder, setSortOrder] = useState("recent");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const ctrl = new AbortController();
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const sources = await loadSources(ALL_SOURCES, ctrl.signal);
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Ao entrar pela página com outro botão, pré-marca as categorias daquele tipo
  // e volta ordenação/busca ao padrão. O usuário pode ajustar tudo no filtro.
  useEffect(() => {
    setSelectedCategories(TIPO_PRESELECT[tipo]);
    setSortOrder("recent");
    setSearch("");
  }, [tipo]);

  // Categorias efetivamente presentes nos dados carregados — multi-seleção
  // adaptativa, na ordem canônica.
  const availableCategories = useMemo(() => {
    const present = new Set(articles.map((a) => a.category));
    return CATEGORY_ORDER.filter((c) => present.has(c));
  }, [articles]);

  // Lista renderizada: filtra por categoria (nenhuma marcada = todas), aplica a
  // busca por texto (título/descrição) e reordena.
  const visibleArticles = useMemo(() => {
    const q = search.trim().toLowerCase();
    let filtered = selectedCategories.length
      ? articles.filter((a) => selectedCategories.includes(a.category))
      : articles;
    if (q) {
      filtered = filtered.filter(
        (a) =>
          (a.title ?? "").toLowerCase().includes(q) ||
          (a.description ?? "").toLowerCase().includes(q),
      );
    }
    return filtered.toSorted(sortByDate(sortOrder));
  }, [articles, selectedCategories, sortOrder, search]);

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.mainContent}>
        <div className={styles.titleContainer}>
          <h1 className={styles.pageTitle}>{PAGE_TITLE}</h1>
          <button
            type="button"
            className={styles.filterButton}
            aria-label={FILTER_LABEL}
            onClick={() => setFilterOpen(true)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z" fill="#39542D"/>
            </svg>
          </button>
        </div>

        <div className={styles.searchBar}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Pesquisar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Pesquisar publicações"
          />
          <span className={styles.searchIcon} aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="7" stroke="#39542D" strokeWidth="2" />
              <path d="M20 20L17 17" stroke="#39542D" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </div>

        {loading && <p>{LOADING_TEXT}</p>}
        {error && <p style={{ color: "#C62828" }}>{error}</p>}
        {!loading && !error && articles.length === 0 && (
          <p>Nenhuma publicação disponível no momento.</p>
        )}
        {!loading && !error && articles.length > 0 && visibleArticles.length === 0 && (
          <p>Nenhuma publicação encontrada.</p>
        )}

        <div className={styles.articlesContainer}>
          {visibleArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </main>

      <PublicationsFilter
        isOpen={filterOpen}
        availableCategories={availableCategories}
        initialCategories={selectedCategories}
        initialSort={sortOrder}
        onApply={({ categories, sort }) => {
          setSelectedCategories(categories);
          setSortOrder(sort);
        }}
        onClose={() => setFilterOpen(false)}
      />
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
