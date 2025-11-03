import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { api, qs } from "../api";
import type { Todo } from "../types";
import Controls from "./Controls";
import EditModal from "./EditModal";

export default function TodoList() {
  const { t } = useTranslation();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [ordering, setOrdering] = useState("title");

  const [editing, setEditing] = useState<Todo | null>(null);

  const params = useMemo(() => ({ search, status, ordering }), [search, status, ordering]);

  const load = async () => {
    setLoading(true); setError("");
    try {
      const query = qs(params);
      const r = await api.get(`/todos/${query ? "?" + query : ""}`);
      const data = Array.isArray(r.data) ? r.data : r.data.results;
      setTodos(data);
    } catch (e) {
      setError(t("error_generic")!);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [search, status, ordering]);

  useEffect(() => {
  const h = () => load();
  window.addEventListener("todos:refresh", h);
  return () => window.removeEventListener("todos:refresh", h);
}, []);


  const del = async (id: number) => {
    try { await api.delete(`/todos/${id}/`); setTodos(prev => prev.filter(x => x.id !== id)); }
    catch { setError(t("error_generic")!); }
  };

  const toggle = async (todo: Todo) => {
    const next = todo.status === "offen" ? "in_bearbeitung" :
                 todo.status === "in_bearbeitung" ? "erledigt" : "offen";
    try {
      const r = await api.put(`/todos/${todo.id}/`, { ...todo, status: next });
      setTodos(prev => prev.map(x => x.id === todo.id ? r.data : x));
    } catch { setError(t("error_generic")!); }
  };

  const saveEdit = async (patch: { title: string; description: string; status: Todo["status"] }) => {
    if (!editing) return;
    try {
      const r = await api.put(`/todos/${editing.id}/`, { ...editing, ...patch });
      setTodos(prev => prev.map(x => x.id === editing.id ? r.data : x));
      setEditing(null);
    } catch { setError(t("error_generic")!); }
  };

  return (
    <div>
      <Controls
        search={search} onSearch={setSearch}
        status={status} onStatus={setStatus}
        ordering={ordering} onOrdering={setOrdering}
      />

    {error && (
      <div className="mb-3 p-2 border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm rounded">
        {error}
      </div>
    )}


      {loading && (
        <div className="space-y-2">
          <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>
      )}


      {!loading && todos.length === 0 && (
        <div className="text-gray-500 dark:text-gray-400 text-sm">{t("empty")}</div>
      )}


      <div className="space-y-2">
        {todos.map(ti => (
          <div key={ti.id} className="p-3 bg-white dark:bg-gray-900 rounded shadow flex justify-between items-center">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{ti.title}</h3>
              {ti.description && <p className="text-sm text-gray-500 dark:text-gray-400 break-words">{ti.description}</p>}
              <p className="text-xs text-gray-400 dark:text-gray-500">{t("status")}: {ti.status}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button className="px-2 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100" onClick={()=>setEditing(ti)}>{t("edit")}</button>
              <button className="px-2 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100" onClick={()=>toggle(ti)}>↺</button>
              <button className="px-2 py-1 border rounded hover:bg-red-100 dark:hover:bg-red-900/30 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100" onClick={()=>del(ti.id)}>{t("delete")}</button>
            </div>
          </div>

        ))}
      </div>

      <EditModal
        open={!!editing}
        initial={editing ?? undefined}
        onClose={() => setEditing(null)}
        onSave={saveEdit}
      />
    </div>
  );
}
