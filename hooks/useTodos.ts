"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createTodo, deleteTodo as apiDelete, fetchTodos, updateTodo } from "@/lib/todosApi";
import type { Todo, TodoId } from "@/types/todo";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState<boolean>(false);
  const [pendingIds, setPendingIds] = useState<Set<TodoId>>(new Set());
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTodos(ac.signal);
      setTodos(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load todos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    return () => abortRef.current?.abort();
  }, [load]);

  const addTodo = useCallback(async (title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setAdding(true);
    setError(null);
    const temp: Todo = { id: Date.now(), title: trimmed, completed: false };
    setTodos((prev) => [temp, ...prev]);
    try {
      const created = await createTodo({ title: trimmed });
      setTodos((prev) => prev.map((t) => (t.id === temp.id ? created : t)));
    } catch (e) {
      setTodos((prev) => prev.filter((t) => t.id !== temp.id));
      setError(e instanceof Error ? e.message : "Failed to add todo");
    } finally {
      setAdding(false);
    }
  }, []);

  const toggleComplete = useCallback(async (id: TodoId) => {
    setPendingIds((s) => new Set(s).add(id));
    setError(null);
    let target: Todo | undefined;
    setTodos((prev) => {
      const next = prev.map((t) => {
        if (t.id === id) {
          target = t;
          return { ...t, completed: !t.completed };
        }
        return t;
      });
      return next;
    });
    try {
      const newCompleted = !(target?.completed ?? false);
      await updateTodo({ id, completed: newCompleted });
    } catch (e) {
      // revert on error
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
      setError(e instanceof Error ? e.message : "Failed to update todo");
    } finally {
      setPendingIds((s) => {
        const n = new Set(s);
        n.delete(id);
        return n;
      });
    }
  }, []);

  const removeTodo = useCallback(async (id: TodoId) => {
    setPendingIds((s) => new Set(s).add(id));
    setError(null);
    let removed: Todo | undefined;
    setTodos((prev) => {
      const idx = prev.findIndex((t) => t.id === id);
      if (idx >= 0) removed = prev[idx];
      return prev.filter((t) => t.id !== id);
    });
    try {
      await apiDelete(id);
    } catch (e) {
      // revert
      if (removed) setTodos((prev) => [removed!, ...prev]);
      setError(e instanceof Error ? e.message : "Failed to delete todo");
    } finally {
      setPendingIds((s) => {
        const n = new Set(s);
        n.delete(id);
        return n;
      });
    }
  }, []);

  const pending = useMemo(() => pendingIds, [pendingIds]);

  return {
    todos,
    loading,
    error,
    adding,
    pendingIds: pending,
    reload: load,
    addTodo,
    toggleComplete,
    removeTodo,
  } as const;
}

