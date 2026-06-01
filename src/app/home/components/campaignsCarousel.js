"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./campaignsCarousel.module.css";

export default function CampaignsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const campaigns = [
    {
      id: 1,
      image: "/images/campaign1.jpeg",
      title: "Título da Campanha",
      description: "Breve resumo da campanha",
    },
    {
      id: 2,
      image: "/images/campaign2.jpeg",
      title: "Campanha Exemplo",
      description: "Outro resumo campanha x",
    },
    {
      id: 3,
      image: "/images/campaign3.jpeg",
      title: "Outro título",
      description: "Resumo diferente",
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === campaigns.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? campaigns.length - 1 : prevIndex - 1
    );
  };

  const getVisibleCampaigns = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(campaigns[(currentIndex + i) % campaigns.length]);
    }
    return visible;
  };

  const visibleCampaigns = getVisibleCampaigns();

  return (
    <div className={styles.carouselContainer}>
      <button className={styles.navButton} onClick={prevSlide} aria-label="Previous">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <div className={styles.carouselContent}>
        {visibleCampaigns.map((campaign, index) => (
          <div key={`${campaign.id}-${index}`} className={styles.campaignCard}>
            <div className={styles.imageContainer}>
              <Image
                src={campaign.image}
                alt={campaign.title}
                className={styles.campaignImage}
                width={400}
                height={250}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{campaign.title}</h3>
              <p className={styles.cardDescription}>{campaign.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className={styles.navButton} onClick={nextSlide} aria-label="Next">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}
