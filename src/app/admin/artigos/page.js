"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import AdminTable from "../components/adminTable";
import ConfirmModal from "../components/confirmModal";

// Merged list of articles + news. Each row carries a synthetic `_kind`
// discriminator ("article" | "news") that drives edit and delete routing —
// backend has separate endpoints, but for admins the two are the same
// mental model ("publicações").
export default function AdminArtigosPage() {
  const router = useRouter();
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, items: [] });
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [articlesRes, newsRes] = await Promise.all([
        api.articles.list({ limit: 100 }),
        api.news.list({ limit: 100 }),
      ]);
      const articles = (articlesRes?.data ?? []).map((a) => ({
        ...a,
        _kind: "article",
        _typeLabel: a.category === "Boas Práticas" ? "Boas Práticas" : "Artigo",
      }));
      const news = (newsRes?.data ?? []).map((n) => ({
        ...n,
        _kind: "news",
        _typeLabel: "Notícia",
      }));
      const merged = [...articles, ...news].toSorted((a, b) => {
        const at = a.publishedAt || a.createdAt || "";
        const bt = b.publishedAt || b.createdAt || "";
        return bt.localeCompare(at);
      });
      setRows(merged);
    } catch (err) {
      setError(err?.message || "Falha ao carregar publicações.");
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
      for (const item of confirm.items) {
        if (item._kind === "news") await api.news.remove(item.id);
        else await api.articles.remove(item.id);
      }
      setSelected(new Set());
      setConfirm({ open: false, items: [] });
      await load();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? `Falha ao deletar: ${err.message}`
          : "Falha ao deletar.";
      setError(message);
      setConfirm({ open: false, items: [] });
    } finally {
      setDeleting(false);
    }
  };

  const goEdit = (id) => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    router.push(`/admin/artigos/${row._kind}/${row.id}`);
  };

  const goDelete = (ids) => {
    const items = rows.filter((r) => ids.includes(r.id));
    setConfirm({ open: true, items });
  };

  const columns = [
    { key: "title", label: "Título" },
    { key: "_typeLabel", label: "Tipo", width: 120 },
    {
      key: "publishedAt",
      label: "Publicado em",
      width: 140,
      render: (row) => {
        const d = row.publishedAt || row.createdAt;
        if (!d) return "—";
        return new Date(d).toLocaleDateString("pt-BR");
      },
    },
  ];

  return (
    <>
      <AdminTable
        title="Lista de artigos e notícias"
        columns={columns}
        rows={rows}
        selectedIds={selected}
        onToggleSelect={toggleSelect}
        onSelectAll={toggleSelectAll}
        onAdd={() => router.push("/admin/artigos/novo")}
        onEdit={goEdit}
        onDelete={goDelete}
        loading={loading}
        error={error}
        emptyMessage="Nenhum artigo ou notícia cadastrado."
      />
      <ConfirmModal
        open={confirm.open}
        title={confirm.items.length > 1 ? "Deletar publicações?" : "Deletar publicação?"}
        body={
          confirm.items.length > 1
            ? `Você está prestes a deletar ${confirm.items.length} publicações. Esta ação não pode ser desfeita.`
            : "Esta ação não pode ser desfeita."
        }
        confirmLabel="Deletar"
        destructive
        busy={deleting}
        onCancel={() => !deleting && setConfirm({ open: false, items: [] })}
        onConfirm={runDelete}
      />
    </>
  );
}
