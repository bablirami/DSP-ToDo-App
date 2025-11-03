export default function ThemeToggle() {
  const isDark = document.documentElement.classList.contains("dark");

  const toggle = () => {
    const el = document.documentElement;
    const next = !el.classList.contains("dark");
    el.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      title={isDark ? "Light mode" : "Dark mode"}
      className="px-2 py-1 border rounded text-sm
                 border-gray-300 dark:border-gray-700
                 text-gray-800 dark:text-gray-100
                 hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
