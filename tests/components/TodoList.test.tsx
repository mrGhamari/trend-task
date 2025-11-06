import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TodoList from "@/components/TodoList";

describe("TodoList", () => {
  it("renders empty state", () => {
    render(<TodoList todos={[]} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
  });

  it("renders todo items", () => {
    render(
      <TodoList
        todos={[{ id: 1, title: "Test", completed: false }]}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});

