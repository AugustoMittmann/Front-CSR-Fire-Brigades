"use client";

import Image from "next/image";
import Icons from "@/app/constants/icons";
import styles from "./FAQSearchInput.module.css";

export default function FAQSearchInput({ value, onChange, placeholder = "Pesquisar Dúvidas Frequentes" }) {
  return (
    <form
      role="search"
      className={styles.form}
      onSubmit={(event) => event.preventDefault()}
    >
      <label htmlFor="faq-search" className={styles.visuallyHidden}>
        Pesquisar dúvidas frequentes
      </label>
      <div className={styles.wrapper}>
        <input
          id="faq-search"
          type="search"
          className={styles.input}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-controls="faq-list"
        />
        <span className={styles.icon} aria-hidden="true">
          <Image
            src={Icons.pesquisarverde.value}
            alt=""
            width={20}
            height={20}
          />
        </span>
      </div>
    </form>
  );
}
