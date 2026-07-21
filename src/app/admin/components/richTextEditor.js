"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import Label from "../../components/label";
import styles from "./richTextEditor.module.css";

// Quill touches `document` at module load, so it can't run under React's
// server renderer. `next/dynamic` with `ssr: false` guarantees the import
// only happens on the client after hydration.
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div style={{ padding: "0.75rem", color: "#757575" }}>Carregando editor…</div>
  ),
});

// Modest toolbar matching the wireframe's B/I/U hint, plus links and simple
// lists — anything more complex encourages content that the public site can't
// render consistently.
const TOOLBAR = [
  ["bold", "italic", "underline"],
  ["link"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["clean"],
];

const MODULES = { toolbar: TOOLBAR };
const FORMATS = ["bold", "italic", "underline", "link", "list"];

/**
 * Controlled rich-text editor that stores HTML in `value` and reports the
 * new HTML through `onChange(html)`. The value round-trips cleanly through
 * the backend's `body` field (plain HTML string).
 */
export default function RichTextEditor({ label, value = "", onChange, error = false }) {
  return (
    <div className={styles.wrapper}>
      {label && <Label text={label} />}
      <div className={`${styles.editor} ${error ? styles.error : ""}`}>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={(html) => onChange?.(html)}
          modules={MODULES}
          formats={FORMATS}
        />
      </div>
    </div>
  );
}
