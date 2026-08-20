'use client'

import { useEffect, useRef, useState } from "react";
import styles from "./searchbar.module.css";
import Label from "@/app/components/label";
import Image from "next/image";
import Icons from "@/app/constants/icons";

export default function SearchBar({
  label,
  placeholder,
  height,
  type = "text",
  disabled = false,
  onSearch,
  debounceMs = 300,
  initialValue = "",
}) {
  const inputRef = useRef(null);
  const [value, setValue] = useState(initialValue);
  const debounced = useDebounced(value, debounceMs);

  const lastSent = useRef(null);
  useEffect(() => {
    if (!onSearch) return;
    if (lastSent.current === debounced) return;
    lastSent.current = debounced;
    onSearch(debounced);
  }, [debounced, onSearch]);

  const getStyle = () => {
    if (disabled) {
      return styles.disabled;
    }
    return styles.input;
  };

  const controlled = Boolean(onSearch);

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
          {...(controlled
            ? { value, onChange: (e) => setValue(e.target.value) }
            : {})}
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

export function useDebounced(value, ms) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}
