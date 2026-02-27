'use client'

import { useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import ArticleCard from "./components/articleCard";
import styles from "./artigosPage.module.css";
import Image from "next/image";

export default function ArtigosPage() {
  const [articles] = useState([
    {
      id: 1,
      category: "Campanha",
      categoryColor: "#1E88E5",
      title: "Título da Notícia",
      description: "Breve descrição Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed urna sed neque blandit gravida vitae bibendum dictum. Lorem dolor...",
      image: "/placeholder-brigade.svg"
    },
    {
      id: 2,
      category: "Boas Práticas",
      categoryColor: "#7CB342",
      title: "Título da Notícia",
      description: "Breve descrição Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed urna sed neque blandit gravida vitae bibendum dictum. Lorem dolor...",
      image: "/placeholder-brigade.svg"
    },
    {
      id: 3,
      category: "Artigo",
      categoryColor: "#F9A825",
      title: "Título da Notícia",
      description: "Breve descrição Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed urna sed neque blandit gravida vitae bibendum dictum. Lorem dolor...",
      image: "/placeholder-brigade.svg"
    },
    {
      id: 4,
      category: "Notícia",
      categoryColor: "#D32F2F",
      title: "Título da Notícia",
      description: "Breve descrição Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed urna sed neque blandit gravida vitae bibendum dictum. Lorem dolor...",
      image: "/placeholder-brigade.svg"
    }
  ]);

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.mainContent}>
        <div className={styles.titleContainer}>
          <h1 className={styles.pageTitle}>Artigos e Notícias</h1>
          <button className={styles.filterButton} aria-label="Filtrar artigos">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z" fill="#39542D"/>
            </svg>
          </button>
        </div>

        <div className={styles.articlesContainer}>
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </main>
    </div>
  );
}
