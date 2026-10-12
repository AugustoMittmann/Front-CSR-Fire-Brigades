"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./campaignsCarousel.module.css";
import { api } from "@/lib/api";

const VISIBLE_COUNT = 3;
const CAMPAIGN_LIMIT = 5;
const PLACEHOLDER_IMAGE = "/placeholder-brigade.svg";

const SLIDE_STEP = `(100% + 0.75rem) / ${VISIBLE_COUNT}`;

const byMostRecent = (a, b) =>
  (Date.parse(b.publishedAt || b.createdAt) || 0) -
  (Date.parse(a.publishedAt || a.createdAt) || 0);

const normalizeCampaign = (c) => ({
  id: c.id,
  title: c.title ?? "",
  description: c.description ?? "",
  image: c.imageUrl || PLACEHOLDER_IMAGE,
});

export default function CampaignsCarousel() {
  const [campaigns, setCampaigns] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Desktop (>=1024px) exibe uma grade estática; mobile mantém o carrossel.
  // Começa `false` para o render do servidor casar com o 1º render do cliente
  // (evita hydration mismatch); o matchMedia ajusta após montar.
  const [isDesktop, setIsDesktop] = useState(false);

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const hasInteracted = useRef(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.campaigns.list(
          { limit: CAMPAIGN_LIMIT },
          { signal: controller.signal },
        );
        const sorted = (res?.data ?? [])
          .map(normalizeCampaign)
          .toSorted(byMostRecent);
        setCampaigns(sorted);
        setCurrentIndex(0);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("[CampaignsCarousel] load failed", err);
        setError("Não foi possível carregar as campanhas.");
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, []);

  const maxIndex = Math.max(0, campaigns.length - VISIBLE_COUNT);
  const idx = Math.min(currentIndex, maxIndex);
  const atStart = idx === 0;
  const atEnd = idx >= maxIndex;

  const prevSlide = () => {
    hasInteracted.current = true;
    setCurrentIndex((i) => Math.max(0, Math.min(i, maxIndex) - 1));
  };

  const nextSlide = () => {
    hasInteracted.current = true;
    setCurrentIndex((i) => Math.min(maxIndex, i + 1));
  };

  useEffect(() => {
    if (!hasInteracted.current) return;
    const active = document.activeElement;
    const focusLost =
      active === document.body ||
      (atEnd && active === nextRef.current) ||
      (atStart && active === prevRef.current);
    if (!focusLost) return;
    if (atEnd && !atStart) prevRef.current?.focus();
    else if (atStart && !atEnd) nextRef.current?.focus();
  }, [idx, atStart, atEnd]);

  const trackTransform = `translateX(calc(-1 * ${idx} * ${SLIDE_STEP}))`;

  // Card reutilizado pelo carrossel (mobile) e pela grade (desktop). Leva
  // direto para a página da campanha (/publicacao/campaign-<id>), no mesmo
  // formato de slug composto que a listagem usa.
  const renderCard = (campaign, { hidden } = {}) => (
    <Link
      key={campaign.id}
      href={`/publicacao/campaign-${campaign.id}`}
      className={styles.campaignCard}
      aria-hidden={hidden ? "true" : undefined}
      tabIndex={hidden ? -1 : undefined}
    >
      <div className={styles.imageContainer}>
        <Image
          src={campaign.image}
          alt=""
          className={styles.campaignImage}
          width={400}
          height={250}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className={styles.cardContent}>
        <p className={styles.cardTitle}>{campaign.title}</p>
        <p className={styles.cardDescription}>{campaign.description}</p>
      </div>
    </Link>
  );

  // Estados compartilhados (carregando / erro / vazio).
  if (error) {
    return (
      <section className={styles.carouselContainer} role="region" aria-label="Campanhas">
        <p className={styles.stateMessage} role="alert">{error}</p>
      </section>
    );
  }
  if (loading) {
    return (
      <section className={styles.carouselContainer} role="region" aria-label="Campanhas">
        <div className={styles.srOnly} role="status" aria-live="polite">Carregando campanhas...</div>
        <p className={styles.stateMessage}>Carregando campanhas...</p>
      </section>
    );
  }
  if (campaigns.length === 0) {
    return (
      <section className={styles.carouselContainer} role="region" aria-label="Campanhas">
        <p className={styles.stateMessage}>Nenhuma campanha disponível no momento.</p>
      </section>
    );
  }

  // Desktop: grade estática com todas as campanhas, alinhada ao título.
  if (isDesktop) {
    return (
      <section className={styles.grid} role="region" aria-label="Campanhas">
        {campaigns.map((campaign) => renderCard(campaign))}
      </section>
    );
  }

  // Mobile: carrossel (comportamento inalterado).
  return (
    <section
      className={styles.carouselContainer}
      role="region"
      aria-roledescription="carrossel"
      aria-label="Campanhas"
    >
      <button
        ref={prevRef}
        className={styles.navButton}
        onClick={prevSlide}
        disabled={atStart}
        aria-label="Campanha anterior"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className={styles.carouselViewport}>
        <div
          className={styles.carouselTrack}
          style={{ transform: trackTransform }}
          aria-live="off"
        >
          {campaigns.map((campaign, i) => {
            const visible = i >= idx && i < idx + VISIBLE_COUNT;
            return renderCard(campaign, { hidden: !visible });
          })}
        </div>
      </div>

      <button
        ref={nextRef}
        className={styles.navButton}
        onClick={nextSlide}
        disabled={atEnd}
        aria-label="Próxima campanha"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </section>
  );
}
