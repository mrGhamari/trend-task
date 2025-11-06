"use client";

import TodoItem from "@/components/TodoItem";
import type { Todo, TodoId } from "@/types/todo";

export interface TodoListProps {
  todos: Todo[];
  pendingIds?: Set<TodoId>;
  onToggle: (id: TodoId) => void;
  onDelete: (id: TodoId) => void;
}

export default function TodoList({ todos, pendingIds, onToggle, onDelete }: TodoListProps) {
  if (!todos.length) {
    return (
      <div className="rounded-md border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500">
        No tasks yet. Add your first task above.
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {todos.map((t) => (
        <TodoItem
          key={t.id}
          todo={t}
          pending={pendingIds?.has(t.id)}
          onToggle={onToggle}
          onDelete={onDelete}
        />)
      )}
    </ul>
  );
}

