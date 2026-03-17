import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useImageUpload } from "@/hooks/use-image-upload";

vi.mock("@/libs/supabase/client", () => ({
  createClient: () => ({
    storage: {
      from: () => ({
        upload: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: () => ({
          data: { publicUrl: "https://example.com/test.jpg" },
        }),
      }),
    },
  }),
}));

function createFile(name: string, size: number, type: string): File {
  const buffer = new ArrayBuffer(size);
  return new File([buffer], name, { type });
}

describe("useImageUpload", () => {
  it("has correct initial state", () => {
    const { result } = renderHook(() => useImageUpload());
    expect(result.current.isUploading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("rejects non-JPEG/PNG/WebP files", async () => {
    const { result } = renderHook(() => useImageUpload());
    const file = createFile("doc.pdf", 1024, "application/pdf");

    let url: string | null | undefined;
    await act(async () => {
      url = await result.current.upload(file);
    });

    expect(url).toBeNull();
    expect(result.current.error).toBe(
      "Chỉ hỗ trợ file JPEG, PNG hoặc WebP",
    );
  });

  it("rejects files larger than 5MB", async () => {
    const { result } = renderHook(() => useImageUpload());
    const file = createFile("big.png", 6 * 1024 * 1024, "image/png");

    let url: string | null | undefined;
    await act(async () => {
      url = await result.current.upload(file);
    });

    expect(url).toBeNull();
    expect(result.current.error).toBe("File không được vượt quá 5MB");
  });

  it("uploads valid file and returns public URL", async () => {
    const { result } = renderHook(() => useImageUpload());
    const file = createFile("photo.jpg", 1024, "image/jpeg");

    let url: string | null | undefined;
    await act(async () => {
      url = await result.current.upload(file);
    });

    expect(url).toBe("https://example.com/test.jpg");
    expect(result.current.error).toBeNull();
  });
});
