'use client';

import { useId } from "react";
import styles from "./select.module.css"
import Label from "./label";

export default function Select({label, disabled, placeholder, width, items = [], name, setSelectedKey, hasError, errorMessage}) {
  const reactId = useId();
  const selectId = name ? `select-${name}` : `select-${reactId}`;
  const errorId = `${selectId}-error`;

  const getStyle = () => {
    if (disabled) {
      return styles.disabled;
    }
    if (hasError) {
      return styles.error;
    }
    return styles.select;
  };

  return (
    <div style={{width}}>
      {label &&
        <div className={styles.labelpadding}>
          <Label text={label} htmlFor={selectId}/>
        </div>
      }
      <div>
        <select
          id={selectId}
          className={getStyle()}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => setSelectedKey?.(e.target.value)}
          name={name}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError && errorMessage ? errorId : undefined}
        >
          {items.map((item) => {
            return (
              <option key={item.key} value={item.key}>
                {item.value}
              </option>
            );
          })}
        </select>
      </div>
      {hasError && errorMessage &&
        <span id={errorId} role="alert" className={styles.errormessage}>{errorMessage}</span>
      }
    </div>
  );
}
