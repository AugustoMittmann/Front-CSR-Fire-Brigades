'use client';

import Icons from "../../../constants/icons";
import Image from "next/image";
import styles from "./filterButton.module.css";
import { useState } from 'react'
import FilterPopup from "./filterPopup";

export default function FilterButton() {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className={styles.button} onClick={togglePopup}>
        <div>
            Filtrar
        </div>
        <div>
        <Image
            src={Icons.filtrar.value}
            alt={Icons.filtrar.alt}
            height={32}
            width={24}
        />
        </div>
      </button>
      {isOpen && <FilterPopup isOpen={isOpen} onClose={() => setIsOpen(!isOpen)} />}
    </>
  );
}
