"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/image-upload";
import { Plus, Loader2 } from "lucide-react";

interface TodoFormProps {
  onSubmit: (title: string, description?: string, imageFile?: File) => Promise<void>;
  isLoading?: boolean;
}

export function TodoForm({ onSubmit, isLoading = false }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    await onSubmit(title.trim(), description.trim() || undefined, selectedImage || undefined);
    
    // Clear form
    setTitle("");
    setDescription("");
    handleImageRemove();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="WHAT NEEDS TO BE DONE?"
            disabled={isLoading}
            required
            className="flex-1 p-4 border-3 border-black bg-white text-black font-bold text-lg uppercase tracking-wide placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-4 focus:ring-red-200"
            style={{
              fontFamily: "'Rye', cursive",
              borderRadius: 0,
              boxShadow: 'inset 3px 3px 0px rgba(0,0,0,0.1)',
            }}
          />
          
          <button
            type="submit"
            disabled={!title.trim() || isLoading}
            className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-800 text-white border-3 border-black font-bold text-lg uppercase tracking-wide cursor-pointer transform transition-all duration-200 hover:from-red-800 hover:to-red-600 hover:-translate-y-1 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              fontFamily: "'Barrio', cursive",
              borderRadius: 0,
              boxShadow: '3px 3px 0px #000000, 6px 6px 0px rgba(0,0,0,0.3)',
              transform: 'rotate(-0.5deg)',
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ADDING...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                ADD IT!
              </>
            )}
          </button>
        </div>
        
        <div className="space-y-2">
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add some details... (optional)"
            disabled={isLoading}
            className="w-full p-3 border-2 border-black bg-white text-black font-bold uppercase tracking-wide placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-200"
            style={{
              fontFamily: "'Rye', cursive",
              borderRadius: 0,
              boxShadow: 'inset 2px 2px 0px rgba(0,0,0,0.1)',
            }}
          />
        </div>

        <ImageUpload
          onImageSelect={handleImageSelect}
          onImageRemove={handleImageRemove}
          preview={imagePreview}
          isUploading={isLoading}
          disabled={isLoading}
        />
      </form>
    </div>
  );
}