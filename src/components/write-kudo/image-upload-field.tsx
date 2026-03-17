"use client";

import { useRef } from "react";
import Image from "next/image";
import { useImageUpload } from "@/hooks/use-image-upload";
import { Icon } from "@/components/ui/icon";

interface ImageAttachment {
  url: string;
  file?: File;
}

interface ImageUploadFieldProps {
  images: ImageAttachment[];
  onAdd: (url: string) => void;
  onRemove: (index: number) => void;
  error?: string;
}

export function ImageUploadField({
  images,
  onAdd,
  onRemove,
  error,
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading, error: uploadError } = useImageUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await upload(file);
    if (url) {
      onAdd(url);
    }

    // Reset the input so the same file can be selected again
    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4 flex-wrap">
        <label className="font-[family-name:var(--font-montserrat)] text-[22px] font-bold leading-[28px] text-[#00101A]">
          Image
        </label>

        {images.map((image, index) => (
          <div key={index} className="relative h-[80px] w-[80px]">
            <Image
              src={image.url}
              alt={`Uploaded image ${index + 1}`}
              width={80}
              height={80}
              className="h-[80px] w-[80px] border border-[#998C5F] object-cover"
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#D4271D]"
              aria-label={`Remove image ${index + 1}`}
            >
              <Icon name="close" size={12} className="text-white" />
            </button>
          </div>
        ))}

        {images.length < 5 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex h-12 flex-col items-center justify-center rounded-lg border border-[#998C5F] bg-white px-2 py-1"
          >
            <span className="flex items-center gap-1">
              <Icon name="plus" size={16} className="text-[#00101A]" />
              <span className="font-[family-name:var(--font-montserrat)] text-sm font-bold text-[#00101A]">
                Image
              </span>
            </span>
            <span className="font-[family-name:var(--font-montserrat)] text-xs text-[#999]">
              {isUploading ? "Uploading..." : "T\u1ed1i \u0111a 5"}
            </span>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {(error || uploadError) && (
        <p className="font-[family-name:var(--font-montserrat)] text-sm text-[#E46060]">
          {error || uploadError}
        </p>
      )}
    </div>
  );
}
