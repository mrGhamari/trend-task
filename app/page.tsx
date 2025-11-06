"use client";

import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";
import { useTodos } from "@/hooks/useTodos";

export default function Home() {
  const { todos, loading, error, adding, pendingIds, addTodo, toggleComplete, removeTodo, reload } = useTodos();

  return (
    <div className="min-h-dvh bg-zinc-50">
      <main className="mx-auto max-w-2xl px-4 py-10">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">To-Do List</h1>
          <button
            onClick={reload}
            className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-zinc-100"
            aria-label="Reload"
          >
            <span className="i-[reload] hidden" aria-hidden />
            Refresh
          </button>
        </header>

        <section className="mb-6">
          <TodoForm onAdd={addTodo} disabled={adding} />
        </section>

        {loading && (
          <div className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-600">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
            Loading todos...
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {(todos.length > 0 || !loading) && (
          <TodoList
            todos={todos}
            pendingIds={pendingIds}
            onToggle={toggleComplete}
            onDelete={removeTodo}
          />
        )}
      </main>
    </div>
  );
}
