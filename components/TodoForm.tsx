"use client";

import { useState } from "react";

export interface TodoFormProps {
  onAdd: (title: string) => Promise<void> | void;
  disabled?: boolean;
}

export default function TodoForm({ onAdd, disabled }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [touched, setTouched] = useState(false);

  const isValid = title.trim().length >= 3;
  const canSubmit = isValid && !disabled;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;
    await onAdd(title.trim());
    setTitle("");
    setTouched(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-start w-full">
      <div className="flex-1">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="Add a new task (min 3 chars)"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900"
          aria-invalid={touched && !isValid}
          aria-describedby="title-error"
          disabled={disabled}
        />
        {touched && !isValid && (
          <p id="title-error" className="mt-1 text-xs text-red-600">
            Please enter at least 3 characters
          </p>
        )}
      </div>
      <button
        type="submit"
        className="inline-flex items-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!canSubmit}
        aria-disabled={!canSubmit}
      >
        {disabled ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Adding...
          </span>
        ) : (
          "Add"
        )}
      </button>
    </form>
  );
}

