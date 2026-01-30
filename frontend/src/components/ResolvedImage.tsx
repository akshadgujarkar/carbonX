import { useState, useEffect } from "react";
import { resolveImageUrl } from "@/lib/firestore-projects";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&q=80";

interface ResolvedImageProps {
  /** Firestore projectFiles doc id or http/https/data URL */
  imageRef: string | undefined;
  alt: string;
  className?: string;
  fallback?: string;
}

/**
 * Renders an img with src resolved from a Firestore file ref or URL.
 * Use when metadata.image may be a projectFiles document ID.
 */
export function ResolvedImage({ imageRef, alt, className, fallback = DEFAULT_IMAGE }: ResolvedImageProps) {
  const [src, setSrc] = useState<string>(fallback);

  useEffect(() => {
    if (!imageRef) {
      setSrc(fallback);
      return;
    }
    if (imageRef.startsWith("http:") || imageRef.startsWith("https:") || imageRef.startsWith("data:")) {
      setSrc(imageRef);
      return;
    }
    resolveImageUrl(imageRef).then((url) => setSrc(url || fallback));
  }, [imageRef, fallback]);

  return <img src={src} alt={alt} className={className} />;
}
