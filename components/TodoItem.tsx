"use client";

import type { Todo } from "@/types/todo";

export interface TodoItemProps {
  todo: Todo;
  pending?: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TodoItem({ todo, pending, onToggle, onDelete }: TodoItemProps) {
  return (
    <li
      className="flex items-center gap-3 rounded-md border border-zinc-200 px-3 py-2"
      aria-busy={!!pending}
    >
      <label className="inline-flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          disabled={pending}
          className="h-4 w-4 accent-zinc-900 disabled:opacity-50"
          aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
        />
        <span className={"text-sm " + (todo.completed ? "line-through text-zinc-400" : "text-zinc-900")}>{todo.title}</span>
      </label>
      <div className="ml-auto inline-flex items-center gap-2">
        {pending && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-zinc-900" aria-label="loading" />
        )}
        <button
          onClick={() => onDelete(todo.id)}
          disabled={pending}
          className="rounded-md border px-2 py-1 text-xs text-red-600 border-red-200 hover:bg-red-50 disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </li>
  );
}

