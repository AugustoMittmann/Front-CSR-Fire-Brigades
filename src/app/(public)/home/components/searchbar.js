'use client'

import { useRef, useState } from "react";
import styles from "./searchbar.module.css";
import Label from "@/app/components/label";
import Image from "next/image";
import Icons from "@/app/constants/icons";

export default function SearchBar({label, placeholder, height, type = "text", disabled = false}) {
  const inputRef = useRef(null);

  const getStyle = () => {
    if (disabled) {
      return styles.disabled;
    }
    return styles.input;
  };

  return (
    <>
      {label &&
        <div className={styles.labelpadding}>
          <Label text={label}/>
        </div>
      }
      <div className='position-relative'>
        <input
          ref={inputRef}
          className={getStyle()}
          placeholder={placeholder}
          disabled={disabled}
          type={type}
          style={{height}}
        />
        <i className={styles.icon}>
          <Image
            src={Icons.pesquisarverde.value}
            alt={Icons.pesquisarverde.alt}
            height={20}/>
        </i>
        <br />
      </div>
    </>
  );
}
