import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import type { Status,Todo } from "../types";

type Props = {
  open: boolean;
  initial?: Todo;
  onClose: () => void;
  onSave: (patch: { title: string; description: string; status: Status }) => void;
};

export default function EditModal({ open, initial, onClose, onSave }: Props) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>("offen");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && initial) {
      setTitle(initial.title ?? "");
      setDescription(initial.description ?? "");
      setStatus(initial.status);
      setError("");
    }
  }, [open, initial?.id]);

  if (!open) return null;

  const submit = () => {
    const trimmed = title.trim();
    if (!trimmed) { setError(t("title_required")!); return; }
    onSave({ title: trimmed, description: description.trim(), status });
  };

    return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow w-full max-w-md p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">{t("edit")}</h3>
        {error && <div className="mb-2 text-red-600 dark:text-red-400 text-sm">{error}</div>}
        <div className="flex flex-col gap-2">
            <input className="border rounded p-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                value={title} onChange={e => setTitle(e.target.value)} />
            <input className="border rounded p-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                value={description} onChange={e => setDescription(e.target.value)} placeholder={t("description")!} />
            <select className="border rounded p-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                    value={status} onChange={e => setStatus(e.target.value as Status)}>
            <option value="offen">{t("open")}</option>
            <option value="in_bearbeitung">{t("in_progress")}</option>
            <option value="erledigt">{t("done")}</option>
            </select>
        </div>
        <div className="mt-4 flex justify-end gap-2">
            <button onClick={onClose} className="px-3 py-2 border rounded border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100">
            {t("cancel")}
            </button>
            <button onClick={submit} className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{t("save")}</button>
        </div>
        </div>
    </div>
    );

}
