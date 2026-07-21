"use client";

import { useMemo } from "react";
import Button from "../../components/button";
import styles from "./adminTable.module.css";

/**
 * List table used across admin CRUD screens. Mirrors the wireframe: title on
 * the left, "Editar / Deletar / Adicionar" on the right, a checkbox column,
 * and one row per record.
 *
 * Props:
 *   title       — heading above the table.
 *   columns     — [{ key, label, render?, width? }] — `render(row)` overrides
 *                 the default `row[key]` display and can return any node.
 *   rows        — array of { id, ...fields }. Any row missing an `id` is
 *                 skipped from selection.
 *   selectedIds — Set of currently selected ids (external state so parent
 *                 can react to selection outside the table too).
 *   onToggleSelect(id) — flip one row.
 *   onSelectAll(nextChecked: boolean) — header checkbox handler.
 *   onEdit(id)  — required. Enabled when exactly one row is selected.
 *   onDelete(ids: string[]) — required. Enabled when at least one row is
 *                 selected. Deletion confirmation is the caller's job.
 *   onAdd()     — required. Always enabled.
 *   loading, error, emptyMessage — display states.
 */
export default function AdminTable({
  title,
  columns,
  rows = [],
  selectedIds = new Set(),
  onToggleSelect,
  onSelectAll,
  onEdit,
  onDelete,
  onAdd,
  loading = false,
  error = null,
  emptyMessage = "Nenhum registro encontrado.",
}) {
  const selectableIds = useMemo(
    () => rows.filter((r) => r?.id != null).map((r) => r.id),
    [rows]
  );
  const allSelected =
    selectableIds.length > 0 && selectableIds.every((id) => selectedIds.has(id));
  const singleSelectedId =
    selectedIds.size === 1 ? [...selectedIds][0] : null;
  const canEdit = singleSelectedId != null;
  const canDelete = selectedIds.size >= 1;

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        {title && <h2 className={styles.title}>{title}</h2>}
        <div className={styles.actions}>
          <Button
            placeholder="Editar"
            style="standard"
            disabled={!canEdit}
            onPress={() => canEdit && onEdit(singleSelectedId)}
          />
          <Button
            placeholder="Deletar"
            style="standard"
            disabled={!canDelete}
            onPress={() => canDelete && onDelete([...selectedIds])}
          />
          <Button placeholder="Adicionar" onPress={onAdd} />
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {loading ? (
        <div className={styles.loading}>Carregando…</div>
      ) : rows.length === 0 ? (
        <div className={styles.empty}>{emptyMessage}</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={`${styles.th} ${styles.thCheckbox}`}>
                  <input
                    type="checkbox"
                    aria-label="Selecionar todos"
                    checked={allSelected}
                    onChange={(e) => onSelectAll?.(e.target.checked)}
                  />
                </th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={styles.th}
                    style={col.width ? { width: col.width } : undefined}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const checked = selectedIds.has(row.id);
                return (
                  <tr key={row.id ?? row.key} className={styles.tr}>
                    <td className={`${styles.td} ${styles.thCheckbox}`}>
                      <input
                        type="checkbox"
                        aria-label={`Selecionar ${row.name ?? row.title ?? row.id}`}
                        checked={checked}
                        onChange={() => onToggleSelect?.(row.id)}
                      />
                    </td>
                    {columns.map((col) => (
                      <td key={col.key} className={styles.td}>
                        {col.render ? col.render(row) : row[col.key] ?? "—"}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
