import logoDark from "../assets/logo-light.png";
import logoLight from "../assets/logo-dark.png";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-10 bg-white/70 dark:bg-gray-900/70 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-3xl px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* light*/}
          <img
            src={logoDark}
            alt="Logo"
            className="h-8 sm:h-10 w-auto block dark:hidden
                      drop-shadow-[0_0_1px_rgba(0,0,0,0.25)]"
          />
          {/*Dark*/}
          <img
            src={logoLight}
            alt="Logo"
            className="h-8 sm:h-10 w-auto hidden dark:block
                      drop-shadow-[0_0_2px_rgba(255,255,255,0.15)]"
          />

          <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {t("title")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
