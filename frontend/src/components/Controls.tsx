import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  search: string; onSearch: (v: string) => void;
  status: string; onStatus: (v: string) => void;
  ordering: string; onOrdering: (v: string) => void;
};

export default function Controls({ search, onSearch, status, onStatus, ordering, onOrdering }: Props) {
  const { t, i18n } = useTranslation();
  const [local, setLocal] = useState(search);

  useEffect(() => setLocal(search), [search]);
  useEffect(() => {
    const id = setTimeout(() => onSearch(local.trim()), 300);
    return () => clearTimeout(id);
  }, [local]);

  const orderingOptions = useMemo(
    () => [
      { value: "title", label: t("sort_title") + " ↑" },
      { value: "-title", label: t("sort_title") + " ↓" },
      { value: "status", label: t("sort_status") + " ↑" },
      { value: "-status", label: t("sort_status") + " ↓" },
    ], [i18n.language]
  );

  const fieldCls = "border rounded px-3 py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100";

  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <input
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={t("search")!}
        className={`${fieldCls} w-full sm:w-1/2`}
      />
      <div className="flex gap-2">
        <select value={status} onChange={(e) => onStatus(e.target.value)} className={fieldCls}>
          <option value="">{t("filter_status")}</option>
          <option value="offen">{t("open")}</option>
          <option value="in_bearbeitung">{t("in_progress")}</option>
          <option value="erledigt">{t("done")}</option>
        </select>
        <select value={ordering} onChange={(e) => onOrdering(e.target.value)} className={fieldCls}>
          {orderingOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    </div>
  );
}
