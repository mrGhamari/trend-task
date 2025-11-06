import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import TodoForm from "@/components/TodoForm";

describe("TodoForm", () => {
  it("disables submit when title is too short", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<TodoForm onAdd={onAdd} />);
    const input = screen.getByPlaceholderText(/add a new task/i);
    const button = screen.getByRole("button", { name: /add/i });
    await user.type(input, "hi");
    expect(button).toBeDisabled();
  });

  it("calls onAdd with trimmed title and resets input", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<TodoForm onAdd={onAdd} />);
    const input = screen.getByPlaceholderText(/add a new task/i);
    const button = screen.getByRole("button", { name: /add/i });
    await user.type(input, "   buy milk   ");
    expect(button).toBeEnabled();
    await user.click(button);
    expect(onAdd).toHaveBeenCalledWith("buy milk");
    expect((input as HTMLInputElement).value).toBe("");
  });
});

