'use client'

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import GoogleMap from "../../components/googleMap";
import FilterButton from "../home/components/filterButton";
import Icons from "../../constants/icons";
import { api } from "@/lib/api";

/**
 * Lista pública de brigadas. Combina busca local (debounced) com filtro
 * server-side (passamos `search` para a API quando o termo é estável).
 *
 * Mantém o layout/estilos atuais; o que mudou foi só o conteúdo abaixo dos
 * filtros (lista de cards + estados de loading/erro/vazio).
 */
function ViewBrigades() {
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [brigades, setBrigades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounce simples para não bombardear a API a cada keystroke.
  const debouncedSearch = useDebounced(search, 300);

  useEffect(() => {
    const ctrl = new AbortController();
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.brigades.list(
          {
            limit: 50,
            search: debouncedSearch || undefined,
            state: stateFilter || undefined,
          },
          { signal: ctrl.signal },
        );
        setBrigades(res?.data ?? []);
      } catch (err) {
        if (err.name === "AbortError") return;
        // eslint-disable-next-line no-console
        console.error("[ViewBrigades] load failed", err);
        setError("Não foi possível carregar as brigadas.");
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => ctrl.abort();
  }, [debouncedSearch, stateFilter]);

  // Ordenação A-Z / Z-A feita no client (sobre o que a API já devolveu).
  // "prox" (Proximidade) ainda não tem lógica, então não altera a ordem.
  const sortedBrigades = useMemo(() => {
    if (sortOrder !== "az" && sortOrder !== "za") return brigades;
    const arr = [...brigades].sort((a, b) =>
      (a.name || "").localeCompare(b.name || "", "pt-BR", { sensitivity: "base" }),
    );
    return sortOrder === "za" ? arr.reverse() : arr;
  }, [brigades, sortOrder]);

  return (
    <div style={{margin: "1rem"}}>
      <div style={{display: "flex", flexWrap: "wrap"}}>
        <span style={{color: "#39542D", fontWeight: "bolder", fontSize: "1rem", width: "100%", marginBottom: "1rem", font: "normal normal bold 24px/29px 'Montserrat'", fontFamily: "'Montserrat', sans-serif"}}>Visualizar Brigadas</span>

        <span style={{color: "#39542D", width: "100%", marginBottom: "1rem", font: "normal normal normal 16px/20px 'Montserrat'", fontFamily: "'Montserrat', sans-serif"}}>Navegue pela lista ou pelo mapa para encontrar a Brigada da RNBV mais próxima de você.</span>
        <div style={{width: "100%", position: "relative"}}>
          {/* Input HTML simples — o componente <Input> compartilhado tem
              validação interna e não expõe value/onChange controlados. */}
          <input
            placeholder={"Pesquisar Brigada"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "0.85rem 3rem 0.85rem 1.25rem",
              border: "1px solid #E0E0E0",
              borderRadius: "9999px",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "1rem",
              color: "#39542D",
              boxShadow: "0 1px 4px rgba(0, 0, 0, 0.08)",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          <Image
            src={Icons.pesquisar.value}
            alt={Icons.pesquisar.alt}
            width={22}
            height={22}
            style={{
              position: "absolute",
              right: "1.1rem",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          />
        </div>
        <div style={{display: "flex", gap: "0.7rem", alignItems: "center", textAlign: "center", marginTop: "1.2rem", width: "100%"}}>
          <div style={{flexGrow: 1, textAlign: "left"}}>
            <button
              type="button"
              onClick={() => setIsMapVisible(!isMapVisible)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.7rem",
                height: "48px",
                padding: "0 1rem",
                backgroundColor: "#39542D",
                color: "#FFF",
                border: "1.5px solid #39542D",
                borderRadius: "0.9rem",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              <span>Mapa</span>
              <MapToggle on={isMapVisible} />
            </button>
          </div>
          <div style={{flexGrow: 1, textAlign: "right"}}>
            <FilterButton
              onApply={(f) => {
                setStateFilter(f?.state ?? null);
                setSortOrder(f?.sort ?? null);
              }}
            />
          </div>
        </div>
        {stateFilter && (
          <div style={{width: "100%", marginTop: "0.85rem", display: "flex", alignItems: "center", gap: "0.6rem"}}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              backgroundColor: "#EDF1E8",
              color: "#39542D",
              border: "1px solid #39542D",
              borderRadius: "9999px",
              padding: "0.25rem 0.75rem",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "13px",
              fontWeight: 600,
            }}>
              Estado: {stateFilter}
            </span>
            <button
              type="button"
              onClick={() => setStateFilter(null)}
              style={{
                background: "none",
                border: "none",
                color: "#39542D",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "13px",
                textDecoration: "underline",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Limpar
            </button>
          </div>
        )}
        <div style={{marginTop: "0.5rem", width: "100%"}}>
          {isMapVisible && <GoogleMap/>}
        </div>

        <BrigadeList
          loading={loading}
          error={error}
          brigades={sortedBrigades}
        />
      </div>
    </div>
  );
}

function BrigadeList({ loading, error, brigades }) {
  if (loading) return <p style={{ marginTop: "1rem" }}>Carregando brigadas...</p>;
  if (error) return <p style={{ marginTop: "1rem", color: "#C62828" }}>{error}</p>;
  if (!brigades.length)
    return <p style={{ marginTop: "1rem" }}>Nenhuma brigada encontrada.</p>;

  return (
    <ul style={{ marginTop: "1rem", listStyle: "none", padding: 0, width: "100%" }}>
      {brigades.map((b) => (
        <li key={b.id} style={{ listStyle: "none", marginBottom: "1rem" }}>
          <BrigadeCard brigade={b} />
        </li>
      ))}
    </ul>
  );
}

/**
 * Card da brigada: imagem de fundo com bordas arredondadas, gradiente escuro
 * na base para dar contraste ao texto branco (nome + endereço) e um botão
 * circular com flecha à direita que leva ao perfil da brigada
 * (/brigadesProfilePage?id=<uuid>).
 */
function BrigadeCard({ brigade: b }) {
  const location =
    [b.address, b.city, b.state].filter(Boolean).join(", ") ||
    "Localização não informada";
  const hasImage = Boolean(b.imageUrl);

  return (
    <div
      style={{
        position: "relative",
        height: "180px",
        borderRadius: "16px",
        overflow: "hidden",
        backgroundColor: "#39542D",
        backgroundImage: hasImage ? `url(${b.imageUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
      }}
    >
      {/* Gradiente para legibilidade do texto sobre a imagem. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,0.78) 100%)",
        }}
      />

      {/* Botão flecha -> perfil da brigada. */}
      <Link
        href={`/brigadesProfilePage?id=${b.id}`}
        aria-label={`Abrir perfil de ${b.name}`}
        style={{
          position: "absolute",
          top: "50%",
          right: "1rem",
          transform: "translateY(-50%)",
          width: "56px",
          height: "56px",
          borderRadius: "9999px",
          backgroundColor: "#EDF1E8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textDecoration: "none",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 12h15M13 6l6 6-6 6"
            stroke="#39542D"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>

      {/* Nome + endereço, na base, em branco. */}
      <div
        style={{
          position: "absolute",
          left: "1.1rem",
          right: "5.5rem",
          bottom: "1rem",
          color: "#FFFFFF",
        }}
      >
        <div
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            fontSize: "1.05rem",
            lineHeight: 1.25,
          }}
        >
          {b.name}
        </div>
        <div
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 400,
            fontSize: "0.85rem",
            marginTop: "0.2rem",
            opacity: 0.95,
          }}
        >
          {location}
        </div>
      </div>
    </div>
  );
}

/**
 * Toggle desenhado inline (line-art branco sobre o verde do botão), para
 * bater exatamente com o mock. `on` reflete se o mapa está visível: no estado
 * off o disco maior fica à esquerda; no estado on ele preenche e vai à direita.
 */
function MapToggle({ on }) {
  return (
    <svg
      width="54"
      height="30"
      viewBox="0 0 54 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="1.25"
        y="1.25"
        width="51.5"
        height="27.5"
        rx="13.75"
        fill={on ? "#FFFFFF" : "none"}
        stroke="#FFFFFF"
        strokeWidth="2.5"
      />
      {on ? (
        <>
          <rect x="14" y="10.5" width="2.2" height="9" rx="1.1" fill="#39542D" />
          <circle cx="38" cy="15" r="9" fill="#39542D" />
        </>
      ) : (
        <>
          <circle cx="16" cy="15" r="9" stroke="#FFFFFF" strokeWidth="2.5" />
          <circle cx="38" cy="15" r="4" stroke="#FFFFFF" strokeWidth="2" />
        </>
      )}
    </svg>
  );
}

function useDebounced(value, ms) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

export default ViewBrigades;
