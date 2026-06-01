"use client"
import Questions from "@/app/constants/questionsFAQ";
import { useEffect, useMemo, useState } from "react";
import styles from "./FAQ.module.css";
import Icons from "@/app/constants/icons";
import Image from "next/image";
import FAQSearchInput from "./FAQSearchInput";

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredQuestions = useMemo(() => {
    const normalized = searchTerm.trim().toLocaleLowerCase("pt-BR");
    if (!normalized) {
      return Questions;
    }
    return Questions.filter(({ question, answer }) => {
      const haystack = `${question} ${answer}`.toLocaleLowerCase("pt-BR");
      return haystack.includes(normalized);
    });
  }, [searchTerm]);

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={styles.faqContainer}>
      <FAQSearchInput value={searchTerm} onChange={setSearchTerm} />

      <div role="status" aria-live="polite" aria-atomic="true" className={styles.visuallyHidden}>
        {debouncedTerm
          ? `${filteredQuestions.length} resultado${filteredQuestions.length === 1 ? "" : "s"} encontrado${filteredQuestions.length === 1 ? "" : "s"}.`
          : ""}
      </div>

      {filteredQuestions.length === 0 ? (
        <p className={styles.empty}>Nenhuma dúvida encontrada para “{searchTerm}”.</p>
      ) : (
        <ul id="faq-list" className={styles.list}>
          {filteredQuestions.map((item, index) => (
            <li
              key={index}
              className={`${styles.item} ${
                activeIndex === index ? styles.active : ""
              }`}
            >
              <div
                className={styles.question}
                onClick={() => toggleAnswer(index)}
              >
                {item.question}
                <span
                  className={`${styles.arrow} ${
                    activeIndex === index ? styles.open : ""
                  }`}
                >
                  {activeIndex === index ? <Image
                    src={Icons.uplaranja.value}
                    alt={Icons.uplaranja.alt}
                    width={30} /> : <Image
                    src={Icons.up.value}
                    alt={Icons.up.alt}
                    width={30} />}
                </span>
              </div>
              {activeIndex === index && (
                <div className={styles.answer}>{item.answer}</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
