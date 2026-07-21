"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import styles from "../homepage.module.css";

/**
 * Estatísticas da home derivadas da lista de brigadas do backend.
 *
 * - Organizações  = quantidade de `name` distintos (não vazios)
 * - Brigadistas   = soma de `volunteers` (valores válidos e não negativos)
 * - Estados       = quantidade de `state` distintos (não vazios)
 *
 * Enquanto carrega ou em caso de erro, mostramos "—" em cada bloco para manter
 * o layout estável. Lista vazia é um sucesso legítimo e exibe 0.
 */

const PLACEHOLDER = "—";

/**
 * Deriva as estatísticas a partir da lista de brigadas.
 * Função pura (sem React) para facilitar verificação isolada.
 *
 * @param {Array} brigades
 * @returns {{ organizacoes: number, brigadistas: number, estados: number }}
 */
export function computeStats(brigades) {
  const list = Array.isArray(brigades) ? brigades : [];

  const names = new Set();
  const states = new Set();
  let brigadistas = 0;

  for (const b of list) {
    const name = typeof b?.name === "string" ? b.name.trim() : "";
    if (name) names.add(name);

    // Estados: UFs brasileiras são um conjunto fechado; normalizamos para não
    // contar "SP", "sp" e " SP " como três estados diferentes.
    const state = typeof b?.state === "string" ? b.state.trim().toUpperCase() : "";
    if (state) states.add(state);

    // volunteers pode vir ausente, string ou não numérico — coerção defensiva.
    const volunteers = Number(b?.volunteers);
    if (Number.isFinite(volunteers)) {
      brigadistas += Math.max(0, volunteers);
    }
  }

  return {
    organizacoes: names.size,
    brigadistas,
    estados: states.size,
  };
}

function HomeStats() {
  const [brigades, setBrigades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    const load = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await api.brigades.list(undefined, { signal: ctrl.signal });
        setBrigades(Array.isArray(res?.data) ? res.data : []);
      } catch (err) {
        if (err.name === "AbortError") return;
        // eslint-disable-next-line no-console
        console.error("[HomeStats] load failed", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => ctrl.abort();
  }, []);

  const stats = useMemo(() => computeStats(brigades), [brigades]);

  const show = (value) =>
    loading || error ? PLACEHOLDER : value.toLocaleString("pt-BR");

  return (
    <div className={styles.statsContainer}>
      <div className={styles.statBlock}>
        <div className={styles.statNumber}>{show(stats.organizacoes)}</div>
        <div className={styles.statLabel}>Organizações</div>
      </div>
      <div className={styles.statBlock}>
        <div className={styles.statNumber}>{show(stats.brigadistas)}</div>
        <div className={styles.statLabel}>Brigadistas</div>
      </div>
      <div className={styles.statBlock}>
        <div className={styles.statNumber}>{show(stats.estados)}</div>
        <div className={styles.statLabel}>Estados pelo Brasil</div>
      </div>
    </div>
  );
}

export default HomeStats;
