import styles from "./header.module.css";
import MenuButton from "../(public)/home/components/menuButton";
import HelpButton from "../(public)/home/components/helpButton";
import Link from "next/link";
import Image from "next/image";
import Icons from "../constants/icons";
import MENU_ITEMS from "../constants/menuItems";

export default function Header() {
    return (
      <header className={styles.header}>
        {/* Mobile: botão hambúrguer. Escondido no desktop (>=1024px). */}
        <div className={styles.menuWrap}>
          <MenuButton />
        </div>
        <div className={styles.logoWrap}>
          <Link href="/home">
            <Image
              src={Icons.logo.value}
              alt={Icons.logo.alt}
              height={80}
              width={80}
            />
          </Link>
        </div>
        {/* Mobile: atalho de ajuda. Escondido no desktop (>=1024px). */}
        <Link href="/FAQPage" className={styles.helpWrap}>
          <div>
            <HelpButton />
          </div>
        </Link>
        {/* Desktop: navegação horizontal. Escondida no mobile (base). */}
        <nav className={styles.desktopNav} aria-label="Navegação principal">
          {MENU_ITEMS.map(({ href, label }) => {
            const isHome = href === "/home";
            const linkClass = isHome
              ? `${styles.desktopNavLink} ${styles.navHome}`
              : styles.desktopNavLink;
            return (
              <Link key={`${href}-${label}`} href={href} className={linkClass}>
                {label}
              </Link>
            );
          })}
        </nav>
      </header>
    );
  }
