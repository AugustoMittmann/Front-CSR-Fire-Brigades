'use client'

import { useId, useRef, useState } from "react";
import styles from "./input.module.css";
import Label from "./label";
import PhoneValidator from "../validators/phoneValidator";
import TextValidator from "../validators/textValidator";
import EmailValidator from "../validators/emailValidator";

export default function Input({label, placeholder, height, type = "text", disabled = false, name}) {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Valor inválido");
  const inputRef = useRef(null);
  const reactId = useId();
  const inputId = name ? `input-${name}` : `input-${reactId}`;
  const errorId = `${inputId}-error`;

  const getStyle = () => {
    if (disabled) {
      return styles.disabled;
    }
    if (hasError) {
      return styles.error;
    }
    return styles.input;
  };

  const validateInput = (event) => {
    const isValidValueForType = {
      email: EmailValidator.make(),
      text: TextValidator.make(),
      phone: PhoneValidator.make(event)
    };
    const errorMessageForType = {
      email: "E-mail inválido",
      text: "Valor inválido",
      phone: "Insira um número de telefone válido"
    }
    const isInvalid = !isValidValueForType[type](inputRef.current.value, event);
    setHasError(isInvalid);
    if (isInvalid) {
      setErrorMessage(errorMessageForType[type]);
    }
  };

  return (
    <>
      {label &&
        <div className={styles.labelpadding}>
          <Label text={label} htmlFor={inputId}/>
        </div>
      }
      <div>
        <input
          id={inputId}
          ref={inputRef}
          className={getStyle()}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(event) => validateInput(event)}
          type={type}
          name={name}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? errorId : undefined}
          style={{height}}
        />
        <br />
      </div>
      {hasError &&
        <span
          id={errorId}
          role="alert"
          className={styles.errormessage}
        >
            {errorMessage}
        </span>
      }
    </>
  );
}
