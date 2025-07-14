"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Todo, TodoInsert, TodoUpdate } from "@/lib/database.types";
import { uploadTodoImage, deleteTodoImage } from "@/lib/storage";

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

export async function createTodo(title: string, description?: string, imageUrl?: string): Promise<{ success: boolean; error?: string; todoId?: string }> {
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
    image_url: imageUrl || null,
  };

  // Create the todo
  const { data, error } = await supabase
    .from("todos")
    .insert([todoData])
    .select()
    .single();

  if (error) {
    console.error("Error creating todo:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/protected");
  return { success: true, todoId: data.id };
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

  // First get the todo to check if it has an image
  const { data: todo, error: fetchError } = await supabase
    .from("todos")
    .select("image_url")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (fetchError) {
    console.error("Error fetching todo:", fetchError);
    return { success: false, error: fetchError.message };
  }

  // Delete associated image if exists
  if (todo?.image_url) {
    const deleteImageResult = await deleteTodoImage(todo.image_url);
    if (!deleteImageResult.success) {
      console.error("Error deleting image:", deleteImageResult.error);
      // Don't fail the entire operation, just log the error
    }
  }

  // Delete the todo
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

export async function updateTodoImage(id: string, imageFile: File): Promise<{ success: boolean; error?: string; imageUrl?: string }> {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    redirect("/auth/login");
  }

  // First get the todo to check if it has an existing image
  const { data: todo, error: fetchError } = await supabase
    .from("todos")
    .select("image_url")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (fetchError) {
    console.error("Error fetching todo:", fetchError);
    return { success: false, error: fetchError.message };
  }

  // Delete old image if exists
  if (todo?.image_url) {
    const deleteResult = await deleteTodoImage(todo.image_url);
    if (!deleteResult.success) {
      console.error("Error deleting old image:", deleteResult.error);
      // Continue anyway
    }
  }

  // Upload new image
  const uploadResult = await uploadTodoImage(imageFile, id);
  if (!uploadResult.success || !uploadResult.url) {
    return { success: false, error: uploadResult.error || "Upload failed" };
  }

  // Update todo with new image URL
  const { error: updateError } = await supabase
    .from("todos")
    .update({ image_url: uploadResult.url })
    .eq("id", id)
    .eq("user_id", user.id);

  if (updateError) {
    console.error("Error updating todo with new image:", updateError);
    return { success: false, error: updateError.message };
  }

  revalidatePath("/protected");
  return { success: true, imageUrl: uploadResult.url };
}

export async function removeTodoImage(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    redirect("/auth/login");
  }

  // First get the todo to check if it has an image
  const { data: todo, error: fetchError } = await supabase
    .from("todos")
    .select("image_url")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (fetchError) {
    console.error("Error fetching todo:", fetchError);
    return { success: false, error: fetchError.message };
  }

  // Delete image if exists
  if (todo?.image_url) {
    const deleteResult = await deleteTodoImage(todo.image_url);
    if (!deleteResult.success) {
      console.error("Error deleting image:", deleteResult.error);
      return { success: false, error: deleteResult.error };
    }
  }

  // Update todo to remove image URL
  const { error: updateError } = await supabase
    .from("todos")
    .update({ image_url: null })
    .eq("id", id)
    .eq("user_id", user.id);

  if (updateError) {
    console.error("Error removing image from todo:", updateError);
    return { success: false, error: updateError.message };
  }

  revalidatePath("/protected");
  return { success: true };
}