"use server";

import { createClient } from "@/lib/supabase/server";

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadTodoImage(file: File, todoId: string): Promise<UploadResult> {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: "User not authenticated" };
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: "Invalid file type. Please upload JPEG, PNG, WebP, or GIF images." };
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return { success: false, error: "File too large. Please upload images smaller than 5MB." };
    }

    // Create unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const fileName = `${todoId}_${timestamp}.${extension}`;
    const filePath = `${user.id}/${todoId}/${fileName}`;

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload file to Supabase Storage
    const { error } = await supabase.storage
      .from('todo-images')
      .upload(filePath, uint8Array, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      return { success: false, error: `Upload failed: ${error.message}` };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('todo-images')
      .getPublicUrl(filePath);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: "An unexpected error occurred during upload" };
  }
}

export async function deleteTodoImage(imageUrl: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: "User not authenticated" };
    }

    // Extract file path from URL
    const url = new URL(imageUrl);
    const pathSegments = url.pathname.split('/');
    const bucketIndex = pathSegments.findIndex(segment => segment === 'todo-images');
    
    if (bucketIndex === -1 || bucketIndex === pathSegments.length - 1) {
      return { success: false, error: "Invalid image URL" };
    }

    const filePath = pathSegments.slice(bucketIndex + 1).join('/');

    // Verify user owns this file
    if (!filePath.startsWith(user.id)) {
      return { success: false, error: "Unauthorized to delete this image" };
    }

    // Delete file from storage
    const { error } = await supabase.storage
      .from('todo-images')
      .remove([filePath]);

    if (error) {
      console.error('Storage delete error:', error);
      return { success: false, error: `Delete failed: ${error.message}` };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    return { success: false, error: "An unexpected error occurred during deletion" };
  }
}

