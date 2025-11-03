export type Status = "offen" | "in_bearbeitung" | "erledigt";

export interface Todo {
  id: number;
  title: string;
  description: string;
  status: Status;
}

export type NewTodo = Omit<Todo, "id">;
