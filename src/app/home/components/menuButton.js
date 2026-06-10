"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Icons from "../../constants/icons";
import styles from "./menuButton.module.css";

const MENU_ITEMS = [
  { href: "/home", label: "Página Inicial", icon: Icons.globo },
  { href: "/viewBrigadesPage", label: "Visualizar Brigadas", icon: Icons.localizacao },
  { href: "/historiaPage", label: "História da RNBV", icon: Icons.livro },
  { href: "/viewCampaignsPage", label: "Campanhas", icon: Icons.globo },
  { href: "/artigosPage", label: "Artigos e Notícias", icon: Icons.jornal },
  { href: "/contactPage", label: "Entrar em contato", icon: Icons.mailverde },
  { href: "/FAQPage", label: "Dúvidas Frequentes", icon: Icons.ajudaverde },
];

export default function MenuButton() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);
  const toggle = () => setOpen((v) => !v);

  // Trava o scroll do body enquanto o menu está aberto.
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Fecha com a tecla Esc.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const triggerClassName = `${styles.iconButton} ${open ? styles.rotated : ""}`;

  return (
    <>
      <button
        type="button"
        className={triggerClassName}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        aria-controls="main-menu-overlay"
        onClick={toggle}
      >
        <Image src={Icons.menu.value} alt="" height={20} width={20} />
      </button>

      <div
        id="main-menu-overlay"
        className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        aria-hidden={!open}
      >
        <div className={styles.overlayHeader}>
          <button
            type="button"
            className={`${styles.iconButton} ${styles.rotated}`}
            aria-label="Fechar menu"
            onClick={close}
          >
            <Image src={Icons.menu.value} alt="" height={20} width={20} />
          </button>
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Fechar menu"
            onClick={close}
          >
            <Image src={Icons.fechar.value} alt="" height={22} width={22} />
          </button>
        </div>

        <h2 className={styles.overlayTitle}>O que você deseja fazer?</h2>

        <nav>
          <ul className={styles.menuList}>
            {MENU_ITEMS.map(({ href, label, icon }) => (
              <li key={`${href}-${label}`} className={styles.menuItem}>
                <Link href={href} className={styles.menuLink} onClick={close}>
                  <span className={styles.menuIcon}>
                    <Image src={icon.value} alt="" height={20} width={20} />
                  </span>
                  <span className={styles.menuLabel}>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
