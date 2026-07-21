"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import Input from "../../components/input";
import Label from "../../components/label";
import FormShell, { formStyles } from "../components/formShell";

/**
 * Shared FAQ form for create + edit. FAQs are simple enough not to warrant a
 * separate reusable form file the way brigadas and artigos got — inlined here.
 */
export default function FaqForm({ mode = "create", id = null, initial = null }) {
  const router = useRouter();
  const [form, setForm] = useState(() => ({
    question: initial?.question ?? "",
    answer: initial?.answer ?? "",
    position: initial?.position ?? "",
  }));
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ kind: "idle" });

  const setField = (key) => (event) => {
    const value = event?.target ? event.target.value : event;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      setStatus({
        kind: "error",
        message: "Pergunta e resposta são obrigatórios.",
      });
      return;
    }
    setSubmitting(true);
    setStatus({ kind: "idle" });
    try {
      const body = {
        question: form.question.trim(),
        answer: form.answer.trim(),
      };
      if (form.position !== "" && form.position != null) {
        body.position = Number(form.position);
      }
      if (mode === "edit" && id) {
        await api.faqs.update(id, body);
      } else {
        await api.faqs.create(body);
      }
      setStatus({ kind: "success", message: "FAQ salva com sucesso." });
      router.push("/admin/faqs");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err?.message || "Falha ao salvar FAQ.";
      setStatus({ kind: "error", message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormShell
      title={mode === "edit" ? "Editar dúvida" : "Nova dúvida"}
      onSubmit={submit}
      onCancel={() => router.push("/admin/faqs")}
      submitting={submitting}
      success={status.kind === "success" ? status.message : null}
      error={status.kind === "error" ? status.message : null}
    >
      <div className={formStyles.gridFull}>
        <Input
          label="Pergunta"
          name="question"
          required
          value={form.question}
          onChange={setField("question")}
        />
      </div>
      <div>
        <Input
          label="Posição"
          name="position"
          type="number"
          min={0}
          step={1}
          value={form.position}
          onChange={setField("position")}
        />
      </div>
      <div className={formStyles.gridFull}>
        <Label text="Resposta" />
        <textarea
          className={formStyles.textarea}
          value={form.answer}
          onChange={setField("answer")}
          rows={6}
        />
      </div>
    </FormShell>
  );
}
