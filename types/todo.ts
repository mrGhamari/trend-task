export type TodoId = number;

export interface Todo {
  id: TodoId;
  title: string;
  completed: boolean;
  userId?: number;
}

export interface CreateTodoInput {
  title: string;
}

export interface UpdateTodoInput {
  id: TodoId;
  title?: string;
  completed?: boolean;
}

