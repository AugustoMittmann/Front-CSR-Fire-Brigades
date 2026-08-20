'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import LatestNewsCarousel from "./components/latestNewsCarousel";
import styles from "./page.module.css";

/**
 * Página de detalhe de uma publicação (campanha, notícia ou artigo).
 *
 * A lista em `viewCampaignsPage` unifica os três tipos e gera ids compostos no
 * formato `campaign-<id>` / `news-<id>` / `article-<id>`. Aqui o slug é
 * quebrado no PRIMEIRO hífen apenas, porque o id em si é um UUID e também
 * contém hífens.
 *
 * A tela mostra o título e, em seguida, o corpo completo. O `body` é HTML
 * produzido pelo editor rich-text do admin (react-quill), então é renderizado
 * via dangerouslySetInnerHTML. Quando não há `body` (ex.: campanha que só tem
 * `description` em texto puro), caímos no texto simples preservando quebras.
 *
 * Abaixo do texto, quando houver dados configurados no banco (para qualquer
 * tipo de publicação), exibimos nesta ordem: imagem de capa, botão de doação
 * (copia a chave PIX), os Resultados (GET /api/campaigns/:id/results), as
 * Últimas notícias (carrossel), as Brigadas Participantes
 * (GET /api/{tipo}/:id/brigades) e novamente o botão de doação.
 * Seções sem dados simplesmente não são renderizadas.
 */

const RESOURCE_BY_PREFIX = {
  campaign: "campaigns",
  news: "news",
  article: "articles",
};

const parseSlug = (slug) => {
  const sep = slug.indexOf("-");
  if (sep === -1) return { resource: null, id: null };
  const prefix = slug.slice(0, sep);
  const id = slug.slice(sep + 1);
  return { resource: RESOURCE_BY_PREFIX[prefix] ?? null, id };
};

const copyToClipboard = async (text) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Fallback para contextos sem a Clipboard API.
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
};

/**
 * Botão de doação PIX. Estado de feedback local para poder ser usado em mais
 * de um ponto da página sem que os botões compartilhem o "copiado".
 */
function DonateBlock({ pix }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await copyToClipboard(pix);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopied(false);
    }
  };
  return (
    <>
      <button type="button" className={styles.donateButton} onClick={handleCopy}>
        Faça uma doação
      </button>
      <p className={styles.donateFeedback} role="status" aria-live="polite">
        {copied ? "Chave PIX copiada!" : ""}
      </p>
    </>
  );
}

export default function PublicationDetailPage() {
  const { slug } = useParams();
  const { resource, id } = parseSlug(String(slug ?? ""));
  const isCampaign = resource === "campaigns";

  const [item, setItem] = useState(null);
  const [results, setResults] = useState([]);
  const [brigades, setBrigades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    const load = async () => {
      if (!resource) {
        setError("Publicação não encontrada.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const [res, resultsRes, brigadesRes] = await Promise.all([
          api[resource].get(id, { signal: ctrl.signal }),
          isCampaign
            ? api.campaigns.results(id, { signal: ctrl.signal })
            : Promise.resolve(null),
          api[resource].brigades(id, { signal: ctrl.signal }),
        ]);
        setItem(res?.data ?? res);
        setResults(resultsRes?.data ?? []);
        setBrigades(brigadesRes?.data ?? []);
      } catch (err) {
        if (err.name === "AbortError") return;
        // eslint-disable-next-line no-console
        console.error("[PublicationDetail] load failed", err);
        setError("Não foi possível carregar a publicação.");
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => ctrl.abort();
  }, [slug]);

  if (loading) return <p className={styles.state}>Carregando...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!item) return null;

  const html = item.body?.trim() ? item.body : null;
  const fallback = item.description || item.summary || item.subtitle || "";

  return (
    <article className={styles.wrapper}>
      <h1 className={styles.title}>{item.title}</h1>

      {html ? (
        <div
          className={styles.body}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <div className={styles.body} style={{ whiteSpace: "pre-wrap" }}>
          {fallback}
        </div>
      )}

      {item.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={styles.coverImage}
          src={item.imageUrl}
          alt={item.title}
        />
      )}

      {item.pix && <DonateBlock pix={item.pix} />}

      {results.length > 0 && (
        <>
          <h2 className={styles.resultsHeading}>Resultados</h2>
          <div className={styles.resultsBox}>
            {results.map((r) => (
              <div key={r.id} className={styles.resultItem}>
                <span className={styles.resultValue}>{r.value}</span>
                <span className={styles.resultLabel}>{r.label}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <LatestNewsCarousel excludeId={resource === "news" ? id : null} />

      {brigades.length > 0 && (
        <section className={styles.brigadesSection}>
          <h2 className={styles.brigadesHeading}>Brigadas Participantes</h2>
          <p className={styles.brigadesIntro}>
            Agradecemos o reconhecimento e o esforço dos artistas e toda a
            equipe de apoio em divulgar a dedicação dos Brigadistas Voluntários
            do Brasil.
          </p>
          <div className={styles.brigadesGrid}>
            {brigades.map((b) => (
              <div key={b.id} className={styles.brigadeItem}>
                {b.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className={styles.brigadeLogo}
                    src={b.imageUrl}
                    alt={b.name}
                  />
                )}
                <span className={styles.brigadeName}>{b.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {brigades.length > 0 && item.pix && <DonateBlock pix={item.pix} />}
    </article>
  );
}
