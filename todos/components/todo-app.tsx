"use client";

import { useState, useTransition } from "react";
import { TodoForm } from "./todo-form";
import { TodoList } from "./todo-list";
import { createTodo, updateTodo, deleteTodo, toggleTodo } from "@/app/actions/todos";
import { Todo } from "@/lib/database.types";
import { toast } from "sonner";

interface TodoAppProps {
  initialTodos: Todo[];
}

export function TodoApp({ initialTodos }: TodoAppProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [isPending, startTransition] = useTransition();

  const handleCreateTodo = async (title: string, description?: string) => {
    const optimisticTodo: Todo = {
      id: `temp-${Date.now()}`,
      title,
      description: description || null,
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: "temp"
    };

    // Optimistic update
    setTodos(prev => [optimisticTodo, ...prev]);

    startTransition(async () => {
      const result = await createTodo(title, description);
      if (!result.success) {
        // Remove optimistic update on error
        setTodos(prev => prev.filter(todo => todo.id !== optimisticTodo.id));
        toast.error(result.error || "Failed to create todo");
      } else {
        // The server action will revalidate and we'll get the real data
        toast.success("Todo created successfully");
      }
    });
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    // Optimistic update
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id 
          ? { ...todo, completed, updated_at: new Date().toISOString() }
          : todo
      )
    );

    startTransition(async () => {
      const result = await toggleTodo(id, completed);
      if (!result.success) {
        // Revert optimistic update on error
        setTodos(prev => 
          prev.map(todo => 
            todo.id === id 
              ? { ...todo, completed: !completed }
              : todo
          )
        );
        toast.error(result.error || "Failed to update todo");
      }
    });
  };

  const handleUpdateTodo = async (id: string, title: string, description?: string) => {
    // Optimistic update
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id 
          ? { ...todo, title, description: description || null, updated_at: new Date().toISOString() }
          : todo
      )
    );

    startTransition(async () => {
      const result = await updateTodo(id, { title, description });
      if (!result.success) {
        // Revert optimistic update on error - would need to store original values
        toast.error(result.error || "Failed to update todo");
      } else {
        toast.success("Todo updated successfully");
      }
    });
  };

  const handleDeleteTodo = async (id: string) => {
    // Optimistic update
    const originalTodos = todos;
    setTodos(prev => prev.filter(todo => todo.id !== id));

    startTransition(async () => {
      const result = await deleteTodo(id);
      if (!result.success) {
        // Revert optimistic update on error
        setTodos(originalTodos);
        toast.error(result.error || "Failed to delete todo");
      } else {
        toast.success("Todo deleted successfully");
      }
    });
  };

  return (
    <div className="space-y-6">
      <TodoForm onSubmit={handleCreateTodo} isLoading={isPending} />
      <TodoList
        todos={todos}
        onToggle={handleToggleTodo}
        onUpdate={handleUpdateTodo}
        onDelete={handleDeleteTodo}
      />
    </div>
  );
}