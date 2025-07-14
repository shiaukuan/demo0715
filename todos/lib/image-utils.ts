export function getOptimizedImageUrl(imageUrl: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
} = {}): string {
  try {
    const url = new URL(imageUrl);
    const params = new URLSearchParams();
    
    if (options.width) params.set('width', options.width.toString());
    if (options.height) params.set('height', options.height.toString());
    if (options.quality) params.set('quality', options.quality.toString());
    if (options.format) params.set('format', options.format);
    
    if (params.toString()) {
      url.search = params.toString();
    }
    
    return url.toString();
  } catch {
    return imageUrl;
  }
}