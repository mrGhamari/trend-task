import { NextResponse } from "next/server";

// Avoid caching for snapshot data and to keep toggles responsive
export const dynamic = "force-dynamic";

type JPTodo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

const BASE = "https://jsonplaceholder.typicode.com/todos" as const;

const mapToTodo = (t: JPTodo) => ({ id: t.id, title: t.title, completed: t.completed, userId: t.userId });

export async function GET() {
  try {
    const res = await fetch(`${BASE}?_limit=10`, { next: { revalidate: 0 } });
    if (!res.ok) throw new Error(`Upstream error: ${res.status}`);
    const data = (await res.json()) as JPTodo[];
    return NextResponse.json(data.map(mapToTodo));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch todos";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { title?: string };
    const title = body?.title?.trim();
    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const upstream = await fetch(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, completed: false, userId: 1 }),
    });
    if (!upstream.ok) throw new Error(`Upstream error: ${upstream.status}`);
    const created = (await upstream.json()) as Partial<JPTodo>;
    const id = typeof created.id === "number" ? created.id : Date.now();
    return NextResponse.json({ id, title, completed: false, userId: 1 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create todo";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = (await req.json()) as { id?: number; title?: string; completed?: boolean };
    const { id, title, completed } = body ?? {};
    if (!id || typeof id !== "number")
      return NextResponse.json({ error: "Valid id is required" }, { status: 400 });

    const payload: Partial<JPTodo> = {};
    if (typeof title === "string") payload.title = title;
    if (typeof completed === "boolean") payload.completed = completed;
    if (Object.keys(payload).length === 0)
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });

    const upstream = await fetch(`${BASE}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!upstream.ok) throw new Error(`Upstream error: ${upstream.status}`);
    const updated = (await upstream.json()) as JPTodo;
    return NextResponse.json(mapToTodo(updated));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update todo";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = (await req.json()) as { id?: number };
    const id = body?.id;
    if (!id || typeof id !== "number")
      return NextResponse.json({ error: "Valid id is required" }, { status: 400 });

    const upstream = await fetch(`${BASE}/${id}`, { method: "DELETE" });
    if (!upstream.ok) throw new Error(`Upstream error: ${upstream.status}`);
    // JSONPlaceholder returns an empty object; we return the id removed
    return NextResponse.json({ id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete todo";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

