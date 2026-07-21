"use client";

import { useRef, useState } from "react";
// eslint-disable-next-line @next/next/no-img-element -- next/image needs configured remote hosts; admin previews hit arbitrary Supabase/user domains.
import Label from "../../components/label";
import styles from "./imageUploader.module.css";
import { uploadPublicImage } from "@/lib/supabaseStorage";

/**
 * Dual-mode image field. Admins can either:
 *   1. Pick a file → we upload to Supabase Storage → set the public URL.
 *   2. Paste an already-hosted URL directly.
 *
 * The backend only accepts a URL string in `image_url`, so the component's
 * effective value is always the final URL. Uploading is optional; if the
 * Supabase env vars aren't set we still allow URL paste (the uploader shows
 * an inline error if the button is used).
 *
 * Props:
 *   label       — passed to <Label>.
 *   value       — current URL string.
 *   onChange(url: string) — called on both paste and successful upload.
 *   prefix      — folder inside the bucket (e.g. "brigades").
 */
export default function ImageUploader({ label, value = "", onChange, prefix = "misc" }) {
  const fileRef = useRef(null);
  const [status, setStatus] = useState({ kind: "idle" });

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setStatus({ kind: "uploading" });
    try {
      const url = await uploadPublicImage(file, { prefix });
      onChange?.(url);
      setStatus({ kind: "ok" });
    } catch (err) {
      setStatus({ kind: "error", message: err?.message || "Falha no upload." });
    } finally {
      // Reset the file input so re-selecting the same file re-triggers change.
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className={styles.wrapper}>
      {label && <Label text={label} />}
      <div className={styles.controls}>
        <input
          type="url"
          placeholder="Cole a URL da imagem…"
          className={styles.urlInput}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
        <button
          type="button"
          className={styles.fileButton}
          onClick={() => fileRef.current?.click()}
          disabled={status.kind === "uploading"}
        >
          {status.kind === "uploading" ? "Enviando…" : "Selecionar arquivo"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className={styles.fileInput}
          onChange={handleFile}
        />
      </div>
      {status.kind === "error" && <div className={styles.error}>{status.message}</div>}
      {value && (
        <div className={styles.preview}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Pré-visualização" />
        </div>
      )}
    </div>
  );
}
