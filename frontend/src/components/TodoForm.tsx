import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import type { NewTodo } from "../types";

type Props = { onAdd: (t: NewTodo) => Promise<void> | void };

export default function TodoForm({ onAdd }: Props) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) { setError(t("title_required")!); return; }
    setError("");
    await onAdd({ title: trimmed, description: description.trim(), status: "offen" });
    setTitle(""); setDescription("");
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      {error && <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t("title")!}
        className="border p-2 rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder={t("description")!}
        className="border p-2 rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
      />
      <button className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700">
        {t("add")}
      </button>
    </form>
  );
}
