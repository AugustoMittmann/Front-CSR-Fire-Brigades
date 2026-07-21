"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, api } from "@/lib/api";
import Input from "../../components/input";
import Select from "../../components/select";
import Label from "../../components/label";
import StateCodes from "../../constants/estados";
import CitiesByState from "../../constants/cidadesPorEstado";
import FormShell, { formStyles } from "../components/formShell";
import ImageUploader from "../components/imageUploader";

// Empty scaffolding that matches the backend's snake_case body. Kept as a
// factory rather than a constant so React state doesn't share a mutable
// reference across mounts.
const emptyBrigade = () => ({
  slug: "",
  name: "",
  description: "",
  presentation: "",
  email: "",
  phone_number: "",
  instagram: "",
  pix: "",
  acting_area: "",
  volunteers: "",
  foundation: "",
  address: "",
  state: "",
  city: "",
  latitude: "",
  longitude: "",
  image_url: "",
  external_code: "",
});

// Cast blanks to `null` where the backend expects a real value or nothing,
// and coerce numeric strings into numbers so zod stops complaining.
const buildBody = (form) => {
  const body = { ...form };
  for (const [k, v] of Object.entries(body)) {
    if (typeof v === "string" && v.trim() === "") {
      body[k] = null;
    }
  }
  if (body.volunteers != null) body.volunteers = Number(body.volunteers);
  if (body.latitude != null) body.latitude = Number(body.latitude);
  if (body.longitude != null) body.longitude = Number(body.longitude);
  // The API rejects unknown blanks — remove obviously-empty optional keys.
  const clean = {};
  for (const [k, v] of Object.entries(body)) {
    if (v === null || v === undefined) continue;
    if (Number.isNaN(v)) continue;
    clean[k] = v;
  }
  // `name` is the only required field per the zod schema; empty→null above
  // would drop it, so re-add if user typed nothing (validation catches this
  // upstream, this is just belt+suspenders).
  clean.name = form.name;
  return clean;
};

/**
 * BrigadeForm handles both create and edit. Pass `initial` (from
 * api.brigades.get) to prefill, and `mode='edit'` to send PUT vs POST.
 * Redirects back to /admin/brigadas on success.
 */
export default function BrigadeForm({ initial = null, mode = "create", id = null }) {
  const router = useRouter();
  const [form, setForm] = useState(() => ({ ...emptyBrigade(), ...(initial ?? {}) }));
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ kind: "idle" });

  const stateItems = useMemo(
    () => [{ key: "", value: "Selecione…" }, ...StateCodes],
    []
  );
  const cityItems = useMemo(() => {
    const list = CitiesByState[form.state] ?? [];
    return [{ key: "", value: "Selecione…" }, ...list];
  }, [form.state]);

  const setField = (key) => (event) => {
    const value = event?.target ? event.target.value : event;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async () => {
    if (!form.name?.trim()) {
      setStatus({ kind: "error", message: "O nome é obrigatório." });
      return;
    }
    setSubmitting(true);
    setStatus({ kind: "idle" });
    try {
      const body = buildBody(form);
      if (mode === "edit" && id) {
        await api.brigades.update(id, body);
      } else {
        await api.brigades.create(body);
      }
      setStatus({ kind: "success", message: "Brigada salva com sucesso." });
      router.push("/admin/brigadas");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? `${err.message}${err.details?.error?.details ? ` — ${JSON.stringify(err.details.error.details)}` : ""}`
          : err?.message || "Falha ao salvar brigada.";
      setStatus({ kind: "error", message });
    } finally {
      setSubmitting(false);
    }
  };

  const title = mode === "edit" ? "Editar brigada" : "Nova brigada";

  return (
    <FormShell
      title={title}
      onSubmit={submit}
      onCancel={() => router.push("/admin/brigadas")}
      submitting={submitting}
      success={status.kind === "success" ? status.message : null}
      error={status.kind === "error" ? status.message : null}
    >
      <div>
        <Input
          label="Nome"
          name="name"
          value={form.name}
          onChange={setField("name")}
          required
        />
      </div>
      <div>
        <Input
          label="Slug (opcional)"
          name="slug"
          value={form.slug}
          onChange={setField("slug")}
          placeholder="ex: brigada-morro-do-forte"
        />
      </div>
      <div>
        <Input
          label="Endereço"
          name="address"
          value={form.address}
          onChange={setField("address")}
        />
      </div>
      <div>
        <Input
          label="Instagram"
          name="instagram"
          value={form.instagram}
          onChange={setField("instagram")}
          placeholder="https://instagram.com/…"
          type="url"
        />
      </div>
      <div>
        <Select
          label="UF"
          name="state"
          items={stateItems}
          setSelectedKey={(k) =>
            setForm((prev) => ({ ...prev, state: k, city: "" }))
          }
        />
      </div>
      <div>
        <Select
          label="Cidade"
          name="city"
          items={cityItems}
          setSelectedKey={(k) => setForm((prev) => ({ ...prev, city: k }))}
          disabled={!form.state}
        />
      </div>
      <div>
        <Input
          label="E-mail"
          name="email"
          type="email"
          value={form.email}
          onChange={setField("email")}
        />
      </div>
      <div>
        <Input
          label="Telefone"
          name="phone_number"
          type="phone"
          value={form.phone_number}
          onChange={setField("phone_number")}
        />
      </div>
      <div>
        <Input
          label="Voluntários"
          name="volunteers"
          type="number"
          min={0}
          step={1}
          value={form.volunteers}
          onChange={setField("volunteers")}
        />
      </div>
      <div>
        <Input
          label="Fundação"
          name="foundation"
          type="date"
          value={form.foundation}
          onChange={setField("foundation")}
        />
      </div>
      <div>
        <Input
          label="Latitude"
          name="latitude"
          type="number"
          step="0.000001"
          value={form.latitude}
          onChange={setField("latitude")}
        />
      </div>
      <div>
        <Input
          label="Longitude"
          name="longitude"
          type="number"
          step="0.000001"
          value={form.longitude}
          onChange={setField("longitude")}
        />
      </div>
      <div>
        <Input
          label="Chave Pix"
          name="pix"
          value={form.pix}
          onChange={setField("pix")}
        />
      </div>
      <div>
        <Input
          label="Área de atuação"
          name="acting_area"
          value={form.acting_area}
          onChange={setField("acting_area")}
        />
      </div>
      <div className={formStyles.gridFull}>
        <Label text="Descrição" />
        <textarea
          className={formStyles.textarea}
          value={form.description}
          onChange={setField("description")}
          rows={3}
        />
      </div>
      <div className={formStyles.gridFull}>
        <Label text="Apresentação" />
        <textarea
          className={formStyles.textarea}
          value={form.presentation}
          onChange={setField("presentation")}
          rows={4}
        />
      </div>
      <div className={formStyles.gridFull}>
        <ImageUploader
          label="Imagem"
          value={form.image_url}
          onChange={(url) => setForm((prev) => ({ ...prev, image_url: url }))}
          prefix="brigades"
        />
      </div>
      <div>
        <Input
          label="Código externo"
          name="external_code"
          value={form.external_code}
          onChange={setField("external_code")}
        />
      </div>
    </FormShell>
  );
}
