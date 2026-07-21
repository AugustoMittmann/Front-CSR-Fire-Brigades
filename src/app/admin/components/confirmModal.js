"use client";

import { useEffect, useId, useRef } from "react";
import Button from "../../components/button";
import styles from "./confirmModal.module.css";

/**
 * Generic yes/no dialog. Follows the same a11y patterns as saveModal (focus
 * trap, ESC to cancel, `role="dialog"` + aria-modal + aria-labelledby) but
 * decoupled from any routing or hard-coded copy.
 *
 * Props:
 *   open, onCancel, onConfirm — control state + handlers.
 *   title, body — content.
 *   confirmLabel, cancelLabel — button copy.
 *   destructive — swaps the confirm button for a red "danger" variant.
 *   busy — disables buttons while an async confirm handler runs.
 */
export default function ConfirmModal({
  open,
  onCancel,
  onConfirm,
  title,
  body,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  destructive = false,
  busy = false,
}) {
  const modalRef = useRef(null);
  const titleId = useId();
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    previouslyFocused.current =
      typeof document !== "undefined" ? document.activeElement : null;

    const focusables = () =>
      modalRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input, select, textarea'
      ) ?? [];

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCancel?.();
        return;
      }
      if (e.key !== "Tab") return;
      const list = focusables();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    focusables()[0]?.focus();
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused.current?.focus?.();
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onMouseDown={(e) => {
        // Backdrop click cancels — but only if the click started outside the
        // modal (avoids closing when a drag begins inside and releases outside).
        if (e.target === e.currentTarget && !busy) onCancel?.();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={styles.modal}
      >
        <h2 id={titleId} className={styles.title}>{title}</h2>
        <div className={styles.body}>{body}</div>
        <div className={styles.actions}>
          <Button
            placeholder={cancelLabel}
            style="standard"
            onPress={() => !busy && onCancel?.()}
            disabled={busy}
          />
          {destructive ? (
            <button
              type="button"
              className={styles.destructive}
              onClick={() => !busy && onConfirm?.()}
              disabled={busy}
            >
              {busy ? "Aguarde…" : confirmLabel}
            </button>
          ) : (
            <Button
              placeholder={busy ? "Aguarde…" : confirmLabel}
              onPress={() => !busy && onConfirm?.()}
              disabled={busy}
            />
          )}
        </div>
      </div>
    </div>
  );
}
