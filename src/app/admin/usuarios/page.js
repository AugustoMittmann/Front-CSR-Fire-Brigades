"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import AdminTable from "../components/adminTable";
import ConfirmModal from "../components/confirmModal";
import Button from "../../components/button";

// User management uses the profile admin endpoints (all require role admin or
// super_admin server-side). Deletion isn't supported by the backend — instead
// we surface Validar/Revogar as per-row actions, which flip the profile's
// is_validated flag. Bulk delete is intentionally disabled.
export default function AdminUsersPage() {
  const router = useRouter();
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null, action: null });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.profiles.list({ limit: 100 });
      setRows(res?.data ?? []);
    } catch (err) {
      setError(err?.message || "Falha ao carregar usuários.");
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

  const runRowAction = async () => {
    if (!confirm.id || !confirm.action) return;
    setBusyId(confirm.id);
    try {
      if (confirm.action === "revoke") await api.profiles.revoke(confirm.id);
      else if (confirm.action === "validate") await api.profiles.validate(confirm.id);
      setConfirm({ open: false, id: null, action: null });
      await load();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : err?.message || "Falha na operação.";
      setError(message);
      setConfirm({ open: false, id: null, action: null });
    } finally {
      setBusyId(null);
    }
  };

  const columns = [
    { key: "email", label: "E-mail" },
    { key: "displayName", label: "Nome" },
    { key: "role", label: "Papel", width: 130 },
    {
      key: "isValidated",
      label: "Validado",
      width: 100,
      render: (row) => (row.isValidated ? "Sim" : "Não"),
    },
    {
      key: "_actions",
      label: "Ações",
      width: 200,
      render: (row) => (
        <div style={{ display: "flex", gap: 6 }}>
          {row.isValidated ? (
            <Button
              placeholder="Revogar"
              style="standard"
              disabled={busyId === row.id}
              onPress={() =>
                setConfirm({ open: true, id: row.id, action: "revoke" })
              }
            />
          ) : (
            <Button
              placeholder="Validar"
              disabled={busyId === row.id}
              onPress={() =>
                setConfirm({ open: true, id: row.id, action: "validate" })
              }
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminTable
        title="Lista de usuários"
        columns={columns}
        rows={rows}
        selectedIds={selected}
        onToggleSelect={toggleSelect}
        onSelectAll={toggleSelectAll}
        onAdd={() => router.push("/admin/usuarios/novo")}
        onEdit={(id) => router.push(`/admin/usuarios/${id}`)}
        onDelete={() =>
          setError(
            "A exclusão de usuários não está disponível — utilize 'Revogar' para desativar o acesso."
          )
        }
        loading={loading}
        error={error}
        emptyMessage="Nenhum usuário cadastrado."
      />
      <ConfirmModal
        open={confirm.open}
        title={
          confirm.action === "revoke"
            ? "Revogar acesso?"
            : "Validar usuário?"
        }
        body={
          confirm.action === "revoke"
            ? "O usuário perderá o acesso ao painel administrativo até ser validado novamente."
            : "O usuário passará a ter acesso ao painel administrativo."
        }
        destructive={confirm.action === "revoke"}
        busy={busyId === confirm.id}
        onCancel={() =>
          !busyId && setConfirm({ open: false, id: null, action: null })
        }
        onConfirm={runRowAction}
      />
    </>
  );
}
