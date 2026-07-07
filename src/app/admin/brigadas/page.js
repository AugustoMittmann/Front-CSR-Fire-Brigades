"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import AdminTable from "../components/adminTable";
import ConfirmModal from "../components/confirmModal";

// Lists all brigades in a checkbox-first table. Selecting exactly one row
// enables Editar; ≥1 selection enables Deletar (which fires a confirmation
// modal and deletes sequentially). Adicionar always routes to /admin/brigadas/nova.
export default function AdminBrigadasPage() {
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
      const res = await api.brigades.list({ limit: 100 });
      setRows(res?.data ?? []);
    } catch (err) {
      setError(err?.message || "Falha ao carregar brigadas.");
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
  const toggleSelectAll = (nextChecked) => {
    setSelected(nextChecked ? new Set(rows.map((r) => r.id)) : new Set());
  };

  const runDelete = async () => {
    setDeleting(true);
    try {
      // Sequential deletes so we can surface which one failed. Small N — no
      // point in parallelising and losing that per-item error signal.
      for (const id of confirm.ids) {
        await api.brigades.remove(id);
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
    { key: "name", label: "Nome" },
    { key: "city", label: "Cidade" },
    { key: "state", label: "UF", width: 60 },
    {
      key: "volunteers",
      label: "Voluntários",
      width: 110,
      render: (row) => row.volunteers ?? 0,
    },
  ];

  return (
    <>
      <AdminTable
        title="Lista de brigadas"
        columns={columns}
        rows={rows}
        selectedIds={selected}
        onToggleSelect={toggleSelect}
        onSelectAll={toggleSelectAll}
        onAdd={() => router.push("/admin/brigadas/nova")}
        onEdit={(id) => router.push(`/admin/brigadas/${id}`)}
        onDelete={(ids) => setConfirm({ open: true, ids })}
        loading={loading}
        error={error}
        emptyMessage="Nenhuma brigada cadastrada ainda."
      />
      <ConfirmModal
        open={confirm.open}
        title={confirm.ids.length > 1 ? "Deletar brigadas?" : "Deletar brigada?"}
        body={
          confirm.ids.length > 1
            ? `Você está prestes a deletar ${confirm.ids.length} brigadas. Esta ação não pode ser desfeita.`
            : "Esta ação não pode ser desfeita."
        }
        confirmLabel="Deletar"
        destructive
        busy={deleting}
        onCancel={() => !deleting && setConfirm({ open: false, ids: [] })}
        onConfirm={runDelete}
      />
    </>
  );
}
