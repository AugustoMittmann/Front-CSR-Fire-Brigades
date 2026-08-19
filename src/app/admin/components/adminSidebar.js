"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth0 } from "@auth0/auth0-react";
import styles from "./adminSidebar.module.css";
import Button from "../../components/button";

const LINKS = [
  { href: "/admin/redefinir-senha", label: "Redefinir senha" },
  { href: "/admin/brigadas", label: "Gerenciar brigadas" },
  { href: "/admin/artigos", label: "Gerenciar artigos" },
  { href: "/admin/faqs", label: "Gerenciar FAQs" },
  { href: "/admin/usuarios", label: "Gerenciar usuários" },
];

// Navigation for the admin panel.
//
// Desktop (>720px): a fixed vertical sidebar — the nav list is always visible
// and the mobile toggle button is hidden via CSS.
//
// Mobile (<=720px): a compact top bar showing the brand + a hamburger button.
// The nav list is collapsed by default and expands as a dropdown when toggled.
// This keeps page content immediately visible instead of pushing it below a
// full-height column. The disclosure is wired for accessibility: aria-expanded
// /aria-controls on the button, Escape to close, outside-click to close, and
// auto-close on route change so the panel never lingers over the new page.
export default function AdminSidebar() {
  const pathname = usePathname() || "";
  const { logout } = useAuth0();
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);

  // Close the mobile dropdown whenever the route changes — tapping a link
  // navigates, and we don't want the menu covering the destination page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // While open, close on Escape or on a click/tap outside the nav.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <nav
      ref={navRef}
      className={styles.sidebar}
      aria-label="Navegação administrativa"
    >
      <div className={styles.bar}>
        <div className={styles.brand}>Conexão Brigada · Admin</div>
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="admin-nav-menu"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span aria-hidden="true">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      <div
        id="admin-nav-menu"
        className={`${styles.menu} ${open ? styles.menuOpen : ""}`}
      >
        {LINKS.map((link) => {
          const isActive =
            pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.link} ${isActive ? styles.active : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              {link.label}
            </Link>
          );
        })}
        <div className={styles.logout}>
          <Button
            placeholder="Sair"
            style="standard"
            onPress={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          />
        </div>
      </div>
    </nav>
  );
}
