import React from 'react';
import styles from './navigationCard.module.css';

export const NavigationCard = ({ 
  title = "Cinzas da Floresta", 
  backgroundImage,
  onArrowClick 
}) => {
  return (
    <div className={`${styles['navigation-card']} position-relative rounded`}>
      <div 
        className={styles['navigation-card__background']}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className={styles['navigation-card__overlay']} />
      </div>
      
      <div className={styles['navigation-card__content']}>
        <h2 className={styles['navigation-card__title']}>{title}</h2>
      </div>

      <button 
        className={`${styles['navigation-card__arrow']} flex align-center justify-center`} 
        onClick={onArrowClick}
        aria-label="View more"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </div>
  );
};