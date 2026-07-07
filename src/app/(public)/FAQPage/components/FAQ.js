"use client"
import { useEffect, useMemo, useState } from "react";
import styles from "./FAQ.module.css";
import Icons from "@/app/constants/icons";
import Image from "next/image";
import FAQSearchInput from "./FAQSearchInput";
import { api } from "@/lib/api";

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Carrega FAQs do backend uma vez. O filtro continua client-side porque a
  // lista é pequena e o filtro tradicional já existia assim.
  useEffect(() => {
    const ctrl = new AbortController();
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.faqs.list({ limit: 100 }, { signal: ctrl.signal });
        setQuestions(res?.data ?? []);
      } catch (err) {
        if (err.name === "AbortError") return;
        // eslint-disable-next-line no-console
        console.error("[FAQ] load failed", err);
        setError("Não foi possível carregar as perguntas frequentes.");
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => ctrl.abort();
  }, []);

  const filteredQuestions = useMemo(() => {
    const normalized = searchTerm.trim().toLocaleLowerCase("pt-BR");
    if (!normalized) {
      return questions;
    }
    return questions.filter(({ question, answer }) => {
      const haystack = `${question} ${answer}`.toLocaleLowerCase("pt-BR");
      return haystack.includes(normalized);
    });
  }, [searchTerm, questions]);

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

      {loading && <p className={styles.empty}>Carregando perguntas...</p>}
      {error && <p className={styles.empty} style={{ color: "#C62828" }}>{error}</p>}

      {!loading && !error && filteredQuestions.length === 0 ? (
        <p className={styles.empty}>
          {searchTerm
            ? `Nenhuma dúvida encontrada para “${searchTerm}”.`
            : "Nenhuma pergunta cadastrada ainda."}
        </p>
      ) : (
        !loading && !error && (
          <ul id="faq-list" className={styles.list}>
            {filteredQuestions.map((item, index) => (
              <li
                key={item.id ?? index}
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
        )
      )}
    </div>
  );
}
