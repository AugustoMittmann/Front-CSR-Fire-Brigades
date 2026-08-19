"use client";

import { useEffect, useId, useRef, useState } from "react";
import Label from "../../../components/label";
import styles from "./customSelect.module.css";

// Dropdown customizado fiel ao mock da página de Contato:
// - chevron que inverte ao abrir/fechar
// - painel de opções arredondado com sombra
// - checkmark verde na opção selecionada
//
// Mantém compatibilidade com o form existente (que lê valores via
// document.getElementsByName(name)[0].value) através de um <input type="hidden">.
export default function CustomSelect({
  label,
  placeholder,
  items = [],
  name,
  width,
  value,
  onChange,
  disabled = false,
  searchable = false,
  searchPlaceholder = "Buscar...",
  loading = false,
}) {
  const reactId = useId();
  const selectId = name ? `select-${name}` : `select-${reactId}`;
  const listId = `${selectId}-list`;

  const isControlled = value !== undefined;
  const [internalKey, setInternalKey] = useState("");
  const selectedKey = isControlled ? value : internalKey;
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [query, setQuery] = useState("");
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const searchRef = useRef(null);

  const selectedItem = items.find((item) => item.key === selectedKey);
  const displayText = selectedItem ? selectedItem.value : placeholder;

  // Lista filtrada pelo texto digitado (só quando searchable).
  const visibleItems =
    searchable && query.trim()
      ? items.filter((item) =>
          item.value.toLowerCase().includes(query.trim().toLowerCase()),
        )
      : items;

  // Fecha ao clicar fora.
  useEffect(() => {
    if (!open) return;
    const onClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  // Ao abrir com busca, foca o campo e zera o filtro anterior.
  useEffect(() => {
    if (open && searchable) {
      setQuery("");
      // foca no próximo tick, após o painel montar
      const id = setTimeout(() => searchRef.current?.focus(), 0);
      return () => clearTimeout(id);
    }
  }, [open, searchable]);

  // Mantém o item ativo dentro dos limites da lista filtrada.
  useEffect(() => {
    if (!open) return;
    setActiveIndex((i) => Math.min(i, Math.max(0, visibleItems.length - 1)));
  }, [visibleItems.length, open]);

  const select = (key) => {
    if (!isControlled) setInternalKey(key);
    onChange?.(key);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const toggle = () => {
    if (disabled) return;
    setOpen((prev) => {
      const next = !prev;
      if (next) {
        const idx = items.findIndex((i) => i.key === selectedKey);
        setActiveIndex(idx >= 0 ? idx : 0);
      }
      return next;
    });
  };

  const onKeyDown = (event) => {
    if (disabled) return;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) {
          setOpen(true);
          setActiveIndex(Math.max(0, items.findIndex((i) => i.key === selectedKey)));
        } else {
          setActiveIndex((i) => Math.min(visibleItems.length - 1, i + 1));
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (open) setActiveIndex((i) => Math.max(0, i - 1));
        break;
      case "Enter":
        event.preventDefault();
        if (open && activeIndex >= 0 && visibleItems[activeIndex]) {
          select(visibleItems[activeIndex].key);
        } else {
          toggle();
        }
        break;
      case " ":
        // No modo busca, espaço é digitação normal no input; não alterna.
        if (searchable && open) break;
        event.preventDefault();
        if (open && activeIndex >= 0 && visibleItems[activeIndex]) {
          select(visibleItems[activeIndex].key);
        } else {
          toggle();
        }
        break;
      case "Escape":
        setOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div style={{ width }}>
      {label && (
        <div className={styles.labelpadding}>
          <Label text={label} htmlFor={selectId} />
        </div>
      )}
      <div className={styles.root} ref={rootRef}>
        <button
          type="button"
          id={selectId}
          ref={buttonRef}
          className={`${styles.control} ${open ? styles.controlOpen : ""} ${
            disabled ? styles.disabled : ""
          }`}
          onClick={toggle}
          onKeyDown={onKeyDown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
        >
          <span className={selectedItem ? styles.valueText : styles.placeholderText}>
            {displayText}
          </span>
          <svg
            className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {open && (
          <div className={styles.panel}>
            {searchable && (
              <div className={styles.searchWrap}>
                <input
                  ref={searchRef}
                  type="text"
                  className={styles.searchInput}
                  placeholder={searchPlaceholder}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={onKeyDown}
                  aria-label={searchPlaceholder}
                />
              </div>
            )}
            <ul className={styles.list} id={listId} role="listbox" aria-labelledby={selectId}>
              {loading ? (
                <li className={styles.empty}>Carregando...</li>
              ) : visibleItems.length === 0 ? (
                <li className={styles.empty}>Nenhum resultado</li>
              ) : (
                visibleItems.map((item, index) => {
                  const isSelected = item.key === selectedKey;
                  const isActive = index === activeIndex;
                  return (
                    <li
                      key={item.key}
                      role="option"
                      aria-selected={isSelected}
                      className={`${styles.option} ${isActive ? styles.optionActive : ""} ${
                        isSelected ? styles.optionSelected : ""
                      }`}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => select(item.key)}
                    >
                      <span>{item.value}</span>
                      {isSelected && (
                        <svg
                          className={styles.check}
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#84C868"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Mantém o form existente funcionando (leitura por getElementsByName). */}
      <input type="hidden" name={name} value={selectedKey} readOnly />
    </div>
  );
}
