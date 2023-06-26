"use client";
import Image from "next/image";
import { useState } from "react";

interface BluredImageProps {
  src: string;
  alt: string;
  border?: boolean;
}

export default function BluredImage({ src, alt, border }: BluredImageProps) {
  const [isLoading, setLoading] = useState(true);

  return (
    <div
      className={`${
        border ? "rounded-lg" : ""
      } relative aspect-w-1 aspect-h-1 w-full h-full overflow-hidden bg-gray-200 xl:aspect-w-7 xl:aspect-h-8`}
    >
      <Image
        alt={alt}
        src={src}
        fill
        priority
        sizes="100%"
        style={{ objectFit: "cover" }}
        className={`duration-700 ease-in-out group-hover:scale-110
              ${
                isLoading
                  ? "scale-110 blur-2xl grayscale"
                  : "scale-100 blur-0 grayscale-0"
              })`}
        onLoadingComplete={() => setLoading(false)}
      />
    </div>
  );
}
