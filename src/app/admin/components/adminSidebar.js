"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth0 } from "@auth0/auth0-react";
import styles from "./adminSidebar.module.css";
import Button from "../../components/button";

const LINKS = [
  { href: "/admin/brigadas", label: "Gerenciar brigadas" },
  { href: "/admin/artigos", label: "Gerenciar artigos" },
  { href: "/admin/faqs", label: "Gerenciar FAQs" },
  { href: "/admin/usuarios", label: "Gerenciar usuários" },
  { href: "/admin/redefinir-senha", label: "Redefinir senha" },
];

// Vertical navigation for the admin panel. Uses `startsWith` so /admin/brigadas
// and /admin/brigadas/nova both highlight the same entry. The "Sair" button is
// pinned to the bottom so it doesn't feel like just another destination.
export default function AdminSidebar() {
  const pathname = usePathname() || "";
  const { logout } = useAuth0();

  return (
    <nav className={styles.sidebar} aria-label="Navegação administrativa">
      <div className={styles.brand}>Conexão Brigada · Admin</div>
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
    </nav>
  );
}
