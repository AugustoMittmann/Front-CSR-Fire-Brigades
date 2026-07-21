"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import AdminTable from "../components/adminTable";
import ConfirmModal from "../components/confirmModal";

// Backend has no GET /api/faqs/:id — this list is the source of truth for the
// edit form too (see faqs/[id]/page.js).
export default function AdminFaqsPage() {
  const router = useRouter();
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, ids: [] });
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.faqs.list();
      setRows(res?.data ?? []);
    } catch (err) {
      setError(err?.message || "Falha ao carregar FAQs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const toggleSelectAll = (next) => {
    setSelected(next ? new Set(rows.map((r) => r.id)) : new Set());
  };

  const runDelete = async () => {
    setDeleting(true);
    try {
      for (const id of confirm.ids) {
        await api.faqs.remove(id);
      }
      setSelected(new Set());
      setConfirm({ open: false, ids: [] });
      await load();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? `Falha ao deletar: ${err.message}`
          : "Falha ao deletar.";
      setError(message);
      setConfirm({ open: false, ids: [] });
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: "position", label: "#", width: 60 },
    { key: "question", label: "Pergunta" },
  ];

  return (
    <>
      <AdminTable
        title="Dúvidas frequentes"
        columns={columns}
        rows={rows}
        selectedIds={selected}
        onToggleSelect={toggleSelect}
        onSelectAll={toggleSelectAll}
        onAdd={() => router.push("/admin/faqs/nova")}
        onEdit={(id) => router.push(`/admin/faqs/${id}`)}
        onDelete={(ids) => setConfirm({ open: true, ids })}
        loading={loading}
        error={error}
        emptyMessage="Nenhuma dúvida cadastrada."
      />
      <ConfirmModal
        open={confirm.open}
        title={confirm.ids.length > 1 ? "Deletar FAQs?" : "Deletar FAQ?"}
        body="Esta ação não pode ser desfeita."
        confirmLabel="Deletar"
        destructive
        busy={deleting}
        onCancel={() => !deleting && setConfirm({ open: false, ids: [] })}
        onConfirm={runDelete}
      />
    </>
  );
}
