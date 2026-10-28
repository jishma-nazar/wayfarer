import Image from "next/image";
import { photoUrl } from "@/lib/data";
import type { Photo as PhotoT } from "@/lib/types";
import { cn } from "@/lib/cn";

interface Props {
  photo: PhotoT;
  alt: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  preload?: boolean;
  quality?: number;
}

/** Art-directed Unsplash photo: consistent warm grade, object-position per photo, fills its box. */
export function Photo({ photo, alt, sizes, className, imgClassName, preload, quality }: Props) {
  return (
    // `relative` unless the caller positions it (Tailwind can't resolve two position utilities by order).
    <div className={cn("overflow-hidden bg-paper-2", !/\b(absolute|fixed|sticky)\b/.test(className ?? "") && "relative", className)}>
      <Image
        src={photoUrl(photo)}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        fetchPriority={preload ? "high" : undefined}
        quality={quality}
        className={cn("photo object-cover", imgClassName)}
        style={photo.focus ? { objectPosition: photo.focus } : undefined}
      />
    </div>
  );
}
