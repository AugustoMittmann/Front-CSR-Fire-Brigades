'use client'

import { useRef, useState } from "react";
import styles from "./input.module.css";
import Label from "./label";
import PhoneValidator from "../validators/phoneValidator";
import TextValidator from "../validators/textValidator";
import EmailValidator from "../validators/emailValidator";

export default function Input({label, placeholder, height, type = "text", disabled = false, name}) {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Valor inválido");
  const inputRef = useRef(null);

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
          <Label text={label}/>
        </div>
      }
      <div>
        <input
          ref={inputRef}
          className={getStyle()}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(event) => validateInput(event)}
          type={type}
          name={name}
          style={{height}}
        />
        <br />
      </div>
      {hasError &&
        <span
          className={styles.errormessage}
        >
            {errorMessage}
        </span>
      }
    </>
  );
}
