"use client";

import { useState, useTransition } from "react";
import { TodoForm } from "./todo-form";
import { TodoList } from "./todo-list";
import { createTodo, updateTodo, deleteTodo, toggleTodo } from "@/app/actions/todos";
import { uploadTodoImage, deleteTodoImage } from "@/lib/storage-client";
import { Todo } from "@/lib/database.types";
import { toast } from "sonner";

interface TodoAppProps {
  initialTodos: Todo[];
}

export function TodoApp({ initialTodos }: TodoAppProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [isPending, startTransition] = useTransition();

  const handleCreateTodo = async (title: string, description?: string, imageFile?: File) => {
    const optimisticTodo: Todo = {
      id: `temp-${Date.now()}`,
      title,
      description: description || null,
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: "temp",
      image_url: null
    };

    // Optimistic update
    setTodos(prev => [optimisticTodo, ...prev]);

    startTransition(async () => {
      let imageUrl: string | undefined;

      // Upload image first if provided
      if (imageFile) {
        const uploadResult = await uploadTodoImage(imageFile, optimisticTodo.id);
        if (uploadResult.success && uploadResult.url) {
          imageUrl = uploadResult.url;
        } else {
          toast.error(uploadResult.error || "Failed to upload image");
          // Continue without image
        }
      }

      const result = await createTodo(title, description, imageUrl);
      if (!result.success) {
        // Remove optimistic update on error
        setTodos(prev => prev.filter(todo => todo.id !== optimisticTodo.id));
        toast.error(result.error || "Failed to create todo");
      } else {
        // Update optimistic todo with real data
        if (imageUrl) {
          setTodos(prev => 
            prev.map(todo => 
              todo.id === optimisticTodo.id 
                ? { ...todo, image_url: imageUrl }
                : todo
            )
          );
        }
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

  const handleImageUpdate = async (id: string, imageFile: File) => {
    startTransition(async () => {
      // Upload image first
      const uploadResult = await uploadTodoImage(imageFile, id);
      if (!uploadResult.success || !uploadResult.url) {
        toast.error(uploadResult.error || "Failed to upload image");
        return;
      }

      // Update todo with new image URL
      const result = await updateTodo(id, { image_url: uploadResult.url });
      if (!result.success) {
        toast.error(result.error || "Failed to update todo");
      } else {
        // Optimistic update
        setTodos(prev => 
          prev.map(todo => 
            todo.id === id 
              ? { ...todo, image_url: uploadResult.url || null, updated_at: new Date().toISOString() }
              : todo
          )
        );
        toast.success("Image updated successfully");
      }
    });
  };

  const handleImageRemove = async (id: string) => {
    startTransition(async () => {
      // Get current todo to find image URL
      const todo = todos.find(t => t.id === id);
      if (!todo?.image_url) {
        toast.error("No image to remove");
        return;
      }

      // Delete image from storage first
      const deleteResult = await deleteTodoImage(todo.image_url);
      if (!deleteResult.success) {
        toast.error(deleteResult.error || "Failed to delete image from storage");
        return;
      }

      // Update todo to remove image URL
      const result = await updateTodo(id, { image_url: null });
      if (!result.success) {
        toast.error(result.error || "Failed to update todo");
      } else {
        // Optimistic update
        setTodos(prev => 
          prev.map(todo => 
            todo.id === id 
              ? { ...todo, image_url: null, updated_at: new Date().toISOString() }
              : todo
          )
        );
        toast.success("Image removed successfully");
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
        onImageUpdate={handleImageUpdate}
        onImageRemove={handleImageRemove}
      />
    </div>
  );
}