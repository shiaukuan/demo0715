"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Todo } from "@/lib/database.types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onUpdate: (id: string, title: string, description?: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || "");

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

  return (
    <div className="flex items-start gap-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
      <Checkbox
        checked={todo.completed || false}
        onCheckedChange={(checked) => onToggle(todo.id, checked as boolean)}
        className="mt-1"
      />
      
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Todo title"
              className="font-medium"
              autoFocus
            />
            <Input
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Description (optional)"
              className="text-sm"
            />
          </div>
        ) : (
          <div className="space-y-1">
            <p className={cn(
              "font-medium",
              todo.completed && "line-through text-muted-foreground"
            )}>
              {todo.title}
            </p>
            {todo.description && (
              <p className={cn(
                "text-sm text-muted-foreground",
                todo.completed && "line-through"
              )}>
                {todo.description}
              </p>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Created: {new Date(todo.created_at!).toLocaleDateString()}</span>
              {todo.updated_at && todo.updated_at !== todo.created_at && (
                <span>• Updated: {new Date(todo.updated_at).toLocaleDateString()}</span>
              )}
              {todo.completed && (
                <Badge variant="secondary" className="ml-2">
                  Completed
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        {isEditing ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              disabled={!editTitle.trim()}
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(todo.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}