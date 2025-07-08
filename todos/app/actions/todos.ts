"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Todo, TodoInsert, TodoUpdate } from "@/lib/database.types";

export async function getTodos(): Promise<Todo[]> {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    redirect("/auth/login");
  }

  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching todos:", error);
    return [];
  }

  return data || [];
}

export async function createTodo(title: string, description?: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    redirect("/auth/login");
  }

  const todoData: TodoInsert = {
    title,
    description,
    user_id: user.id,
    completed: false,
  };

  const { error } = await supabase
    .from("todos")
    .insert([todoData]);

  if (error) {
    console.error("Error creating todo:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/protected");
  return { success: true };
}

export async function updateTodo(id: string, updates: Partial<TodoUpdate>): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    redirect("/auth/login");
  }

  const { error } = await supabase
    .from("todos")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating todo:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/protected");
  return { success: true };
}

export async function deleteTodo(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    redirect("/auth/login");
  }

  const { error } = await supabase
    .from("todos")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting todo:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/protected");
  return { success: true };
}

export async function toggleTodo(id: string, completed: boolean): Promise<{ success: boolean; error?: string }> {
  return updateTodo(id, { completed });
}