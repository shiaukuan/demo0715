"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
  preview?: string;
  isUploading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function ImageUpload({
  onImageSelect,
  onImageRemove,
  preview,
  isUploading = false,
  disabled = false,
  className
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (disabled || isUploading) return;
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('請上傳 JPEG、PNG、WebP 或 GIF 格式的圖片');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('檔案大小不能超過 5MB');
      return;
    }

    onImageSelect(file);
  }, [onImageSelect, disabled, isUploading]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragOver(true);
    }
  }, [disabled, isUploading]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled || isUploading) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect, disabled, isUploading]);

  const handleClick = useCallback(() => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  }, [disabled, isUploading]);

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onImageRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onImageRemove]);

  return (
    <div className={cn("space-y-2", className)}>
      <Label>圖片 (可選)</Label>
      
      {preview ? (
        <Card className="relative">
          <CardContent className="p-4">
            <div className="relative group">
              <img
                src={preview}
                alt="預覽圖片"
                className="w-full h-48 object-cover rounded-md"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemove}
                  disabled={disabled || isUploading}
                >
                  <X className="h-4 w-4 mr-1" />
                  移除
                </Button>
              </div>
              {isUploading && (
                <div className="absolute inset-0 bg-white/80 rounded-md flex items-center justify-center">
                  <div className="flex items-center gap-2 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    上傳中...
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card
          className={cn(
            "transition-colors cursor-pointer border-2 border-dashed",
            isDragOver && "border-primary bg-primary/5",
            disabled || isUploading ? "opacity-50 cursor-not-allowed" : "hover:border-primary/50"
          )}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              {isUploading ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">上傳中...</p>
                </>
              ) : (
                <>
                  <div className="p-3 bg-primary/10 rounded-full">
                    <ImageIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">點擊上傳圖片或拖放到此處</p>
                    <p className="text-xs text-muted-foreground">
                      支援 JPEG、PNG、WebP、GIF 格式，最大 5MB
                    </p>
                  </div>
                  <Button type="button" variant="outline" size="sm" disabled={disabled}>
                    <Upload className="h-4 w-4 mr-1" />
                    選擇檔案
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />
    </div>
  );
}