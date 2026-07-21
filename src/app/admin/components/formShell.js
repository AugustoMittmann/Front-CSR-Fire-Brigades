"use client";

import styles from "./formShell.module.css";
import Button from "../../components/button";

/**
 * Consistent chrome for admin create/edit forms. Renders:
 *   - a header with title and optional back button
 *   - success/error banners
 *   - a 2-column grid slot for form fields (single column on narrow screens)
 *   - a footer with Cancel + Save buttons
 *
 * Callers provide the actual field markup as `children` — combined with the
 * exported `formStyles` from formShell.module.css they get grid classes to
 * reach for (`.grid`, `.gridFull` for a full-width field, `.textarea` for
 * textareas that shouldn't inherit the browser default).
 */
export default function FormShell({
  title,
  onSubmit,
  onCancel,
  saveLabel = "Salvar",
  cancelLabel = "Cancelar",
  submitting = false,
  success = null,
  error = null,
  children,
}) {
  return (
    <form
      className={styles.shell}
      onSubmit={(e) => {
        e.preventDefault();
        if (!submitting) onSubmit?.(e);
      }}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
      </div>

      {success && (
        <div role="status" className={`${styles.banner} ${styles.bannerSuccess}`}>
          {success}
        </div>
      )}
      {error && (
        <div role="alert" className={`${styles.banner} ${styles.bannerError}`}>
          {error}
        </div>
      )}

      <div className={styles.grid}>{children}</div>

      <div className={styles.actions}>
        {onCancel && (
          <Button
            placeholder={cancelLabel}
            style="standard"
            type="button"
            onPress={onCancel}
            disabled={submitting}
          />
        )}
        <Button
          placeholder={submitting ? "Salvando…" : saveLabel}
          type="submit"
          disabled={submitting}
          onPress={() => {
            /* Submission is driven by the enclosing <form>; leaving this a
               no-op prevents the shared Button from swallowing the submit. */
          }}
        />
      </div>
    </form>
  );
}

export { styles as formStyles };
