import styles from "./header.module.css";
import MenuButton from "../(public)/home/components/menuButton";
import HelpButton from "../(public)/home/components/helpButton";
import Link from "next/link";
import Image from "next/image";
import Icons from "../constants/icons";

export default function Header() {
    return (
      <header className={styles.header}>
        <div>
          <MenuButton />
        </div>
        <div>
          <Link href="/home">
            <Image
              src={Icons.logo.value}
              alt={Icons.logo.alt}
              height={80}
              width={80}
            />
          </Link>
        </div>
        <Link href="/FAQPage">
          <div>
            <HelpButton />
          </div>
        </Link>
      </header>
    );
  }