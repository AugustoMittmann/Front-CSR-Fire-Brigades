'use client'

import { useEffect, useMemo, useState } from "react";
import Button from "../components/button";
import GoogleMap from "../components/googleMap";
import FilterButton from "../home/components/filterButton";
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
          { limit: 50, search: debouncedSearch || undefined },
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
  }, [debouncedSearch]);

  return (
    <div style={{margin: "1rem"}}>
      <div style={{display: "flex", flexWrap: "wrap"}}>
        <span style={{color: "#39542D", fontWeight: "bolder", fontSize: "1rem", width: "100%", marginBottom: "1rem", font: "normal normal bold 24px/29px 'Montserrat'", fontFamily: "'Montserrat', sans-serif"}}>Visualizar Brigadas</span>

        <span style={{color: "#39542D", width: "100%", marginBottom: "1rem", font: "normal normal normal 16px/20px 'Montserrat'", fontFamily: "'Montserrat', sans-serif"}}>Navegue pela lista ou pelo mapa para encontrar a Brigada mais próxima de você.</span>
        <div style={{width: "100%"}}>
          {/* Input HTML simples — o componente <Input> compartilhado tem
              validação interna e não expõe value/onChange controlados. */}
          <input
            placeholder={"Pesquisar Brigada"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "0.6rem 0.8rem",
              border: "1px solid #DDA15E",
              borderRadius: "8px",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.95rem",
            }}
          />
        </div>
        <div style={{display: "flex", gap: "0.7rem", alignItems: "center", textAlign: "center", marginTop: "1.2rem", width: "100%"}}>
          <div style={{flexGrow: 1}}>
            <Button placeholder="Mapa" onPress={() => setIsMapVisible(!isMapVisible)}/>
          </div>
          <div style={{flexGrow: 1}}>
            <FilterButton />
          </div>
        </div>
        <div style={{marginTop: "0.5rem", width: "100%"}}>
          {isMapVisible && <GoogleMap/>}
        </div>

        <BrigadeList
          loading={loading}
          error={error}
          brigades={brigades}
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
        <li
          key={b.id}
          style={{
            border: "1px solid #DDA15E",
            borderRadius: "8px",
            padding: "0.75rem 1rem",
            marginBottom: "0.5rem",
          }}
        >
          <div style={{ color: "#39542D", fontWeight: "bold", fontSize: "1rem" }}>
            {b.name}
          </div>
          <div style={{ color: "#39542D", fontSize: "0.85rem", marginTop: "0.25rem" }}>
            {[b.city, b.state].filter(Boolean).join(" - ") || "Localização não informada"}
          </div>
          {b.actingArea && (
            <div style={{ color: "#666", fontSize: "0.8rem", marginTop: "0.25rem" }}>
              Atuação: {b.actingArea}
            </div>
          )}
        </li>
      ))}
    </ul>
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
