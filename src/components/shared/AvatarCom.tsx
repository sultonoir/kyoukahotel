"use client";
import Image from "next/image";
import { useState } from "react";

interface AvatarProps {
  src?: string | null | undefined;
  alt?: string | null | undefined;
  width?: number;
  height?: number;
}

const AvatarCom = ({ src, alt, width, height }: AvatarProps) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <Image
      src={src || `/placeholder.jpg`}
      alt={alt || "avatar"}
      width={width || 40}
      height={height || 40}
      priority
      quality={100}
      sizes="100%"
      style={{ objectFit: "cover" }}
      className={`
              duration-700 ease-in-out group-hover:scale-110 rounded-full p-[2px]
              aspect-square
              ${
                isLoading
                  ? "scale-110 blur-2xl grayscale"
                  : "scale-100 blur-0 grayscale-0"
              })`}
      onLoadingComplete={() => setLoading(false)}
    />
  );
};

export default AvatarCom;
