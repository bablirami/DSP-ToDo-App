import { useTranslation } from "react-i18next";
export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const toggle = () => i18n.changeLanguage(i18n.language === "de" ? "en" : "de");
  return (
    <button onClick={toggle} className="ml-2 px-2 py-1 border rounded hover:bg-gray-200">
      {i18n.language.toUpperCase()}
    </button>
  );
}
