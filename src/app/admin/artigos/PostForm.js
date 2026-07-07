"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import Input from "../../components/input";
import Select from "../../components/select";
import Label from "../../components/label";
import FormShell, { formStyles } from "../components/formShell";
import ImageUploader from "../components/imageUploader";
import RichTextEditor from "../components/richTextEditor";

const CATEGORIES = [
  { key: "Artigo", value: "Artigo" },
  { key: "Boas Práticas", value: "Boas Práticas" },
];

const TYPES = [
  { key: "article", value: "Artigo" },
  { key: "news", value: "Notícia" },
];

const emptyPost = () => ({
  slug: "",
  title: "",
  subtitle: "",
  summary: "",
  body: "",
  author: "",
  image_url: "",
  published_at: "",
  // article-only
  category: "Artigo",
  // news-only
  source_url: "",
});

const buildBody = (form, kind) => {
  const base = {
    slug: form.slug || undefined,
    title: form.title,
    subtitle: form.subtitle || undefined,
    summary: form.summary || undefined,
    body: form.body || undefined,
    author: form.author || undefined,
    image_url: form.image_url || undefined,
    // Backend expects an ISO timestamp; empty means "not published yet".
    published_at: form.published_at
      ? new Date(`${form.published_at}T00:00:00Z`).toISOString()
      : undefined,
  };
  if (kind === "article") {
    base.category = form.category || undefined;
  } else {
    base.source_url = form.source_url || undefined;
  }
  // Drop `undefined` so we don't send them.
  return Object.fromEntries(
    Object.entries(base).filter(([, v]) => v !== undefined)
  );
};

/**
 * Unified form for creating/editing an Artigo or Notícia. Which endpoint the
 * form hits is driven by the `kind` state: article → /api/articles, news →
 * /api/news. On edit, `initialKind` is fixed (a record can't change type).
 */
export default function PostForm({
  mode = "create",
  initial = null,
  initialKind = "article",
  id = null,
}) {
  const router = useRouter();
  const [kind, setKind] = useState(initialKind);
  const [form, setForm] = useState(() => ({ ...emptyPost(), ...(initial ?? {}) }));
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ kind: "idle" });

  const setField = (key) => (event) => {
    const value = event?.target ? event.target.value : event;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async () => {
    if (!form.title?.trim()) {
      setStatus({ kind: "error", message: "O título é obrigatório." });
      return;
    }
    setSubmitting(true);
    setStatus({ kind: "idle" });
    try {
      const body = buildBody(form, kind);
      if (mode === "edit" && id) {
        if (kind === "news") await api.news.update(id, body);
        else await api.articles.update(id, body);
      } else if (kind === "news") {
        await api.news.create(body);
      } else {
        await api.articles.create(body);
      }
      setStatus({ kind: "success", message: "Publicação salva com sucesso." });
      router.push("/admin/artigos");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err?.message || "Falha ao salvar publicação.";
      setStatus({ kind: "error", message });
    } finally {
      setSubmitting(false);
    }
  };

  const title = mode === "edit" ? "Editar publicação" : "Nova publicação";

  return (
    <FormShell
      title={title}
      onSubmit={submit}
      onCancel={() => router.push("/admin/artigos")}
      submitting={submitting}
      success={status.kind === "success" ? status.message : null}
      error={status.kind === "error" ? status.message : null}
    >
      <div>
        <Select
          label="Tipo"
          name="kind"
          items={TYPES}
          setSelectedKey={setKind}
          disabled={mode === "edit"}
        />
      </div>
      <div>
        <Input
          label="Título"
          name="title"
          required
          value={form.title}
          onChange={setField("title")}
        />
      </div>
      <div>
        <Input
          label="Slug (opcional)"
          name="slug"
          value={form.slug}
          onChange={setField("slug")}
        />
      </div>
      <div>
        <Input
          label="Autor"
          name="author"
          value={form.author}
          onChange={setField("author")}
        />
      </div>
      <div className={formStyles.gridFull}>
        <Input
          label="Subtítulo"
          name="subtitle"
          value={form.subtitle}
          onChange={setField("subtitle")}
        />
      </div>
      <div>
        <Input
          label="Publicação"
          name="published_at"
          type="date"
          value={form.published_at}
          onChange={setField("published_at")}
        />
      </div>
      {kind === "article" ? (
        <div>
          <Select
            label="Categoria"
            name="category"
            items={CATEGORIES}
            setSelectedKey={(k) => setForm((prev) => ({ ...prev, category: k }))}
          />
        </div>
      ) : (
        <div>
          <Input
            label="URL da fonte"
            name="source_url"
            type="url"
            value={form.source_url}
            onChange={setField("source_url")}
          />
        </div>
      )}
      <div className={formStyles.gridFull}>
        <Label text="Resumo" />
        <textarea
          className={formStyles.textarea}
          value={form.summary}
          onChange={setField("summary")}
          rows={2}
        />
      </div>
      <div className={formStyles.gridFull}>
        <RichTextEditor
          label="Conteúdo"
          value={form.body}
          onChange={(html) => setForm((prev) => ({ ...prev, body: html }))}
        />
      </div>
      <div className={formStyles.gridFull}>
        <ImageUploader
          label="Imagem"
          value={form.image_url}
          onChange={(url) => setForm((prev) => ({ ...prev, image_url: url }))}
          prefix={kind === "news" ? "news" : "articles"}
        />
      </div>
    </FormShell>
  );
}

export const emptyPostShape = emptyPost;
