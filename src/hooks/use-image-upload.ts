"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/libs/supabase/client";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

interface UseImageUploadReturn {
	upload: (file: File) => Promise<string | null>;
	isUploading: boolean;
	error: string | null;
}

export function useImageUpload(): UseImageUploadReturn {
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const upload = useCallback(async (file: File): Promise<string | null> => {
		setError(null);

		if (!ALLOWED_TYPES.includes(file.type)) {
			setError("Chỉ hỗ trợ file JPEG, PNG hoặc WebP");
			return null;
		}

		if (file.size > MAX_SIZE_BYTES) {
			setError("File không được vượt quá 5MB");
			return null;
		}

		setIsUploading(true);

		try {
			const supabase = createClient();
			const ext = file.name.split(".").pop() ?? "jpg";
			const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

			const { error: uploadError } = await supabase.storage
				.from("kudo-images")
				.upload(path, file, {
					cacheControl: "3600",
					upsert: false,
				});

			if (uploadError) {
				// If bucket doesn't exist, fall back to object URL for dev
				if (uploadError.message?.includes("not found") || uploadError.message?.includes("Bucket")) {
					// Dev fallback: create a local object URL
					const objectUrl = URL.createObjectURL(file);
					return objectUrl;
				}
				setError(`Không thể tải ảnh lên: ${uploadError.message}`);
				return null;
			}

			const { data: urlData } = supabase.storage
				.from("kudo-images")
				.getPublicUrl(path);

			return urlData.publicUrl;
		} catch (err) {
			// Dev fallback: if storage is unavailable, use object URL
			const objectUrl = URL.createObjectURL(file);
			return objectUrl;
		} finally {
			setIsUploading(false);
		}
	}, []);

	return { upload, isUploading, error };
}
