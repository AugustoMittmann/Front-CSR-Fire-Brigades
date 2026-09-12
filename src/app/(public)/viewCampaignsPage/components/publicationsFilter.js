'use client'

import { useEffect, useState } from "react";
import styles from "./publicationsFilter.module.css";

/**
 * Popup de filtro da lista de publicações (viewCampaignsPage).
 *
 * Categorias são MULTI-seleção e ADAPTATIVAS: o pai passa apenas as categorias
 * presentes na view atual (`availableCategories`), então em "Artigos e Notícias"
 * não aparece "Campanhas", por exemplo. Nenhuma marcada = mostrar tudo.
 *
 * Ordenação é escolha única entre mais recentes / mais antigos (por data de
 * publicação). O estado é semeado a partir do que o pai já tem aplicado e só é
 * propagado ao clicar em "Salvar filtros".
 */

// Ordem canônica de exibição (espelha o design). Valores = category dos itens.
const CATEGORY_ORDER = ["Campanha", "Boas Práticas", "Artigo", "Notícia"];

// category (singular, como vem do merge) -> rótulo plural exibido no filtro.
const CATEGORY_LABELS = {
  Campanha: "Campanhas",
  "Boas Práticas": "Boas Práticas",
  Artigo: "Artigos",
  "Notícia": "Notícias",
};

export default function PublicationsFilter({
  isOpen,
  availableCategories = [],
  initialCategories = [],
  initialSort = "recent",
  onApply,
  onClose,
}) {
  const [selected, setSelected] = useState(initialCategories);
  const [sort, setSort] = useState(initialSort);

  // Re-semeia o estado sempre que o popup reabre, para refletir o que já está
  // aplicado (e descartar mexidas não salvas da vez anterior).
  useEffect(() => {
    if (!isOpen) return;
    setSelected(initialCategories);
    setSort(initialSort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const ordered = CATEGORY_ORDER.filter((c) => availableCategories.includes(c));

  const toggleCategory = (cat) =>
    setSelected((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );

  const handleSave = () => {
    onApply?.({ categories: selected, sort });
    onClose?.();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.card}
        role="dialog"
        aria-modal="true"
        aria-label="Filtrar publicações"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <span className={styles.title}>Filtrar</span>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Fechar"
          >
            &times;
          </button>
        </div>

        <div className={styles.categories}>
          {ordered.map((cat) => (
            <label key={cat} className={styles.categoryRow}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={selected.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              <span className={styles.categoryLabel}>
                {CATEGORY_LABELS[cat] ?? cat}
              </span>
            </label>
          ))}
        </div>

        <span className={styles.sortHeading}>Ordenar</span>
        <div className={styles.sortButtons}>
          <button
            type="button"
            className={sort === "recent" ? styles.sortActive : styles.sortInactive}
            onClick={() => setSort("recent")}
          >
            Mais recentes primeiro
          </button>
          <button
            type="button"
            className={sort === "oldest" ? styles.sortActive : styles.sortInactive}
            onClick={() => setSort("oldest")}
          >
            Mais antigos primeiro
          </button>
        </div>

        <button type="button" className={styles.saveButton} onClick={handleSave}>
          Salvar filtros
        </button>
      </div>
    </div>
  );
}
