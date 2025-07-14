"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Trash2, Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getOptimizedImageUrl } from "@/lib/image-utils";

interface ImageDisplayProps {
  imageUrl: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
  showControls?: boolean;
  onDelete?: () => void;
  onView?: () => void;
  className?: string;
  rounded?: boolean;
}

export function ImageDisplay({
  imageUrl,
  alt = "Todo 圖片",
  size = 'md',
  showControls = false,
  onDelete,
  onView,
  className,
  rounded = true
}: ImageDisplayProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-32 w-32',
    lg: 'h-48 w-48',
    full: 'h-48 w-full'
  };

  const optimizedUrl = getOptimizedImageUrl(imageUrl, {
    width: size === 'full' ? 400 : size === 'lg' ? 192 : size === 'md' ? 128 : 64,
    quality: 85,
    format: 'webp'
  });

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `todo-image-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleView = () => {
    if (onView) {
      onView();
    } else {
      // Open image in new tab
      window.open(imageUrl, '_blank');
    }
  };

  if (hasError) {
    return (
      <Card className={cn("flex items-center justify-center bg-muted", sizeClasses[size], className)}>
        <CardContent className="p-2 text-center">
          <div className="text-muted-foreground text-xs">
            圖片載入失敗
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div 
      className={cn("relative group", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className={cn("overflow-hidden", sizeClasses[size])}>
        <CardContent className="p-0 h-full">
          <div className="relative h-full">
            {isLoading && (
              <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
                <div className="text-xs text-muted-foreground">載入中...</div>
              </div>
            )}
            
            <img
              src={optimizedUrl}
              alt={alt}
              className={cn(
                "h-full w-full object-cover transition-all duration-200",
                rounded && "rounded-md",
                isLoading && "opacity-0",
                showControls && isHovered && "brightness-75"
              )}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />

            {/* Image Controls Overlay */}
            {showControls && isHovered && !isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleView}
                    className="h-8 w-8 p-0"
                  >
                    <Maximize2 className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleDownload}
                    className="h-8 w-8 p-0"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                  
                  {onDelete && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={onDelete}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Size badge for debugging */}
            {process.env.NODE_ENV === 'development' && (
              <Badge variant="secondary" className="absolute top-1 left-1 text-xs">
                {size}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Full-screen image viewer component
interface ImageViewerProps {
  imageUrl: string;
  alt?: string;
  onClose: () => void;
  isOpen: boolean;
}

export function ImageViewer({ imageUrl, alt = "Todo 圖片", onClose, isOpen }: ImageViewerProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-4xl max-h-full">
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          className="absolute -top-12 right-0 text-white border-white/20 hover:bg-white/10"
        >
          <X className="h-4 w-4 mr-1" />
          關閉
        </Button>
        
        <img
          src={imageUrl}
          alt={alt}
          className="max-w-full max-h-full object-contain rounded-lg"
        />
      </div>
    </div>
  );
}