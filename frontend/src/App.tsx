import { api } from "./api";
import Header from "./components/Header";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import type { NewTodo } from "./types";

export default function App() {
  const add = async (todo: NewTodo) => {
    await api.post("/todos/", todo);
    window.dispatchEvent(new CustomEvent("todos:refresh"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <section className="bg-white dark:bg-gray-900 rounded-2xl shadow p-5">
          <TodoForm onAdd={add} />
        </section>
        <section className="mt-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-3">
            <TodoList />
          </div>
        </section>
      </main>
    </div>
  );
}
