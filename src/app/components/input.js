'use client'

import { useEffect, useId, useRef, useState } from "react";
import styles from "./input.module.css";
import Label from "./label";
import PhoneValidator from "../validators/phoneValidator";
import TextValidator from "../validators/textValidator";
import EmailValidator from "../validators/emailValidator";
import UrlValidator from "../validators/urlValidator";
import NumberValidator from "../validators/numberValidator";
import DateValidator from "../validators/dateValidator";

// Backwards-compatible: existing callers pass only `label/placeholder/name/type`
// and read values via document.getElementsByName (uncontrolled). Admin forms
// pass `value` + `onChange` to run controlled with prefilled data.
//
// Extra props:
//   value        — string, makes the input controlled
//   defaultValue — string, initial value in uncontrolled mode (edit forms
//                  that want the browser to own state after mount)
//   onChange     — (event) => void, called after built-in validation
//   required     — mark the field visually (adds " *" to the label). Actual
//                  required-on-submit gating stays with the form's validate().
//   min/max/step — passed through to <input>; useful for type="number"/"date"
//   autoComplete/inputMode — passed through.
export default function Input({
  label,
  placeholder,
  height,
  type = "text",
  disabled = false,
  name,
  value,
  defaultValue,
  onChange,
  required = false,
  min,
  max,
  step,
  autoComplete,
  inputMode,
}) {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Valor inválido");
  const inputRef = useRef(null);
  const reactId = useId();
  const inputId = name ? `input-${name}` : `input-${reactId}`;
  const errorId = `${inputId}-error`;
  const isControlled = value !== undefined;

  // Keep phone masking working in controlled mode too. PhoneValidator.make
  // mutates event.target.value, so the value returned by the onChange handler
  // must be read from `event.target.value` after we call validateInput below.

  // If a controlled `value` becomes valid externally (e.g. cleared on submit
  // success), we still want the error state to reset.
  useEffect(() => {
    if (isControlled && (value === "" || value == null)) {
      setHasError(false);
    }
  }, [isControlled, value]);

  const validateInput = (event) => {
    // Empty value + not required → don't yell at the user before they type.
    const raw = event.target.value;
    if (raw === "" && !required) {
      setHasError(false);
      return;
    }
    const isValidValueForType = {
      email: EmailValidator.make(),
      text: TextValidator.make(),
      phone: PhoneValidator.make(event),
      url: UrlValidator.make(),
      number: NumberValidator.make(),
      date: DateValidator.make(),
    };
    const errorMessageForType = {
      email: "E-mail inválido",
      text: "Valor inválido",
      phone: "Insira um número de telefone válido",
      url: "URL inválida",
      number: "Insira um número válido",
      date: "Data inválida",
    };
    // Unknown types fall through as valid (e.g. type="password" — we don't
    // second-guess user-facing rules there, forms decide policy on submit).
    const validator = isValidValueForType[type];
    if (!validator) {
      setHasError(false);
      return;
    }
    const isInvalid = !validator(event.target.value, event);
    setHasError(isInvalid);
    if (isInvalid) {
      setErrorMessage(errorMessageForType[type] ?? "Valor inválido");
    }
  };

  const handleChange = (event) => {
    validateInput(event);
    onChange?.(event);
  };

  const getStyle = () => {
    if (disabled) return styles.disabled;
    if (hasError) return styles.error;
    return styles.input;
  };

  return (
    <>
      {label && (
        <div className={styles.labelpadding}>
          <Label
            text={required ? `${label} *` : label}
            htmlFor={inputId}
          />
        </div>
      )}
      <div>
        <input
          id={inputId}
          ref={inputRef}
          className={getStyle()}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleChange}
          type={type}
          name={name}
          {...(isControlled ? { value } : { defaultValue })}
          min={min}
          max={max}
          step={step}
          autoComplete={autoComplete}
          inputMode={inputMode}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? errorId : undefined}
          style={{ height }}
        />
        <br />
      </div>
      {hasError && (
        <span
          id={errorId}
          role="alert"
          className={styles.errormessage}
        >
          {errorMessage}
        </span>
      )}
    </>
  );
}
