import { CreateTodoInput, Todo, TodoId, UpdateTodoInput } from "@/types/todo";

const API_BASE = "/api/todos" as const;

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const data = (await res.json()) as { error?: string };
      if (data?.error) message = data.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  // DELETE may return empty object; still safe to parse
  return (await res.json()) as T;
}

export async function fetchTodos(signal?: AbortSignal): Promise<Todo[]> {
  const res = await fetch(API_BASE, { cache: "no-store", signal });
  return handle<Todo[]>(res);
}

export async function createTodo(
  input: CreateTodoInput,
  signal?: AbortSignal
): Promise<Todo> {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    signal,
  });
  return handle<Todo>(res);
}

export async function updateTodo(
  input: UpdateTodoInput,
  signal?: AbortSignal
): Promise<Todo> {
  const res = await fetch(API_BASE, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    signal,
  });
  return handle<Todo>(res);
}

export async function deleteTodo(id: TodoId, signal?: AbortSignal): Promise<{ id: TodoId }>
{
  const res = await fetch(API_BASE, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
    signal,
  });
  return handle<{ id: TodoId }>(res);
}

