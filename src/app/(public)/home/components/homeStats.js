"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import styles from "../homepage.module.css";

const PLACEHOLDER = "—";

export function computeStats(brigades) {
  const list = Array.isArray(brigades) ? brigades : [];

  const names = new Set();
  const states = new Set();
  let brigadistas = 0;

  for (const b of list) {
    const name = typeof b?.name === "string" ? b.name.trim() : "";
    if (name) names.add(name);

    const state = typeof b?.state === "string" ? b.state.trim().toUpperCase() : "";
    if (state) states.add(state);

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
