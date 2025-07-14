"use client";

import { useState } from "react";
import { ImageDisplay, ImageViewer } from "@/components/image-display";
import { ImageUpload } from "@/components/image-upload";
import { Pencil, Trash2, Save, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Todo } from "@/lib/database.types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onUpdate: (id: string, title: string, description?: string) => void;
  onDelete: (id: string) => void;
  onImageUpdate?: (id: string, imageFile: File) => void;
  onImageRemove?: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onUpdate, onDelete, onImageUpdate, onImageRemove }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || "");
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [isImageEditing, setIsImageEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(todo.id, editTitle.trim(), editDescription.trim() || undefined);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleImageEditCancel = () => {
    setIsImageEditing(false);
    setSelectedImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview("");
    }
  };

  const handleImageUpdate = () => {
    if (selectedImage && onImageUpdate) {
      onImageUpdate(todo.id, selectedImage);
      handleImageEditCancel();
    }
  };

  const handleImageRemoveClick = () => {
    if (onImageRemove) {
      onImageRemove(todo.id);
    }
  };

  const handleImageView = () => {
    setIsImageViewerOpen(true);
  };

  return (
    <div className={`relative flex items-start gap-4 p-6 border-4 border-black transition-all duration-300 ${
      todo.completed 
        ? 'bg-gradient-to-r from-gray-400 to-gray-600 text-white opacity-80' 
        : 'bg-gradient-to-r from-black to-gray-800 text-white'
    }`} style={{
      borderRadius: 0,
      boxShadow: '4px 4px 0px #C41E3A, 8px 8px 0px rgba(0,0,0,0.3)',
    }}>
      {/* Checkbox */}
      <div className="flex-shrink-0 mt-1">
        <input
          type="checkbox"
          checked={todo.completed || false}
          onChange={(e) => onToggle(todo.id, e.target.checked)}
          className="w-6 h-6 border-3 border-white bg-transparent cursor-pointer accent-red-600"
          style={{
            borderRadius: 0,
            appearance: 'none',
            background: todo.completed ? '#C41E3A' : 'transparent',
            position: 'relative',
          }}
        />
      </div>
      
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="TODO TITLE"
              className="w-full p-3 border-2 border-white bg-black text-white font-bold uppercase tracking-wide placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-200"
              style={{
                fontFamily: "'Rye', cursive",
                borderRadius: 0,
              }}
              autoFocus
            />
            <input
              type="text"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="DESCRIPTION (OPTIONAL)"
              className="w-full p-3 border-2 border-white bg-black text-white font-bold uppercase tracking-wide placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-200"
              style={{
                fontFamily: "'Rye', cursive",
                borderRadius: 0,
              }}
            />
          </div>
        ) : (
          <div className="space-y-2">
            <p className={cn(
              "font-bold text-lg uppercase tracking-wide",
              todo.completed && "line-through opacity-70"
            )} style={{fontFamily: "'Rye', cursive"}}>
              {todo.title}
            </p>
            {todo.description && (
              <p className={cn(
                "text-sm font-bold uppercase tracking-wide opacity-80",
                todo.completed && "line-through"
              )} style={{fontFamily: "'Barrio', cursive"}}>
                {todo.description}
              </p>
            )}
            
            {/* Image Display */}
            {todo.image_url && !isImageEditing && (
              <div className="mt-4 p-2 border-2 border-white bg-black">
                <ImageDisplay
                  imageUrl={todo.image_url}
                  alt={`${todo.title} 圖片`}
                  size="md"
                  showControls={true}
                  onView={handleImageView}
                  onDelete={handleImageRemoveClick}
                />
              </div>
            )}

            {/* Image Upload during editing */}
            {isImageEditing && (
              <div className="mt-4 p-3 border-2 border-white bg-black">
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  onImageRemove={() => setSelectedImage(null)}
                  preview={imagePreview}
                  disabled={false}
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleImageUpdate}
                    disabled={!selectedImage}
                    className="px-4 py-2 bg-green-600 text-white border-2 border-white font-bold uppercase tracking-wide cursor-pointer transition-all duration-200 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      fontFamily: "'Barrio', cursive",
                      borderRadius: 0,
                      boxShadow: '2px 2px 0px #000',
                    }}
                  >
                    <Save className="h-3 w-3 mr-1 inline" />
                    SAVE
                  </button>
                  <button
                    onClick={handleImageEditCancel}
                    className="px-4 py-2 bg-gray-600 text-white border-2 border-white font-bold uppercase tracking-wide cursor-pointer transition-all duration-200 hover:bg-gray-700"
                    style={{
                      fontFamily: "'Barrio', cursive",
                      borderRadius: 0,
                      boxShadow: '2px 2px 0px #000',
                    }}
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wide opacity-70" style={{fontFamily: "'Barrio', cursive"}}>
              <span>CREATED: {new Date(todo.created_at!).toLocaleDateString()}</span>
              {todo.updated_at && todo.updated_at !== todo.created_at && (
                <span>• UPDATED: {new Date(todo.updated_at).toLocaleDateString()}</span>
              )}
              {todo.completed && (
                <span className="px-2 py-1 bg-green-600 text-white border border-white" style={{borderRadius: 0}}>
                  COMPLETED
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              disabled={!editTitle.trim()}
              className="p-2 bg-green-600 text-white border-2 border-white font-bold cursor-pointer transition-all duration-200 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderRadius: 0,
                boxShadow: '2px 2px 0px #000',
              }}
            >
              <Save className="h-4 w-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-2 bg-red-600 text-white border-2 border-white font-bold cursor-pointer transition-all duration-200 hover:bg-red-700"
              style={{
                borderRadius: 0,
                boxShadow: '2px 2px 0px #000',
              }}
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              title="EDIT TODO"
              className="p-2 bg-blue-600 text-white border-2 border-white font-bold cursor-pointer transition-all duration-200 hover:bg-blue-700 hover:-translate-y-1"
              style={{
                borderRadius: 0,
                boxShadow: '2px 2px 0px #000',
              }}
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsImageEditing(!isImageEditing)}
              title={todo.image_url ? "UPDATE IMAGE" : "ADD IMAGE"}
              className="p-2 bg-purple-600 text-white border-2 border-white font-bold cursor-pointer transition-all duration-200 hover:bg-purple-700 hover:-translate-y-1"
              style={{
                borderRadius: 0,
                boxShadow: '2px 2px 0px #000',
              }}
            >
              <ImageIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              title="DELETE TODO"
              className="p-2 bg-red-600 text-white border-2 border-white font-bold cursor-pointer transition-all duration-200 hover:bg-red-700 hover:-translate-y-1"
              style={{
                borderRadius: 0,
                boxShadow: '2px 2px 0px #000',
              }}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Punk decorations */}
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-600 border-2 border-white transform rotate-45"></div>
      <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-red-600 border border-white rounded-full"></div>

      {/* Image Viewer Modal */}
      {todo.image_url && (
        <ImageViewer
          imageUrl={todo.image_url}
          alt={`${todo.title} 圖片`}
          isOpen={isImageViewerOpen}
          onClose={() => setIsImageViewerOpen(false)}
        />
      )}
    </div>
  );
}