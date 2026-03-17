import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCreateKudo } from "@/hooks/use-create-kudo";

const mockData = {
  recipientId: "user-1",
  title: "Great job",
  message: "Thanks for the help",
  hashtags: ["teamwork"],
  isAnonymous: false,
};

describe("useCreateKudo", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("has correct initial state", () => {
    const { result } = renderHook(() => useCreateKudo());
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("calls fetch with POST /api/kudos and correct body", async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: () => Promise.resolve({}),
    });
    global.fetch = fetchSpy;

    const { result } = renderHook(() => useCreateKudo());
    await act(() => result.current.submit(mockData));

    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/kudos",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockData),
      }),
    );
  });

  it("calls onSuccess and returns true on 201 response", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: () => Promise.resolve({}),
    });
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useCreateKudo(onSuccess));

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.submit(mockData);
    });

    expect(success).toBe(true);
    expect(onSuccess).toHaveBeenCalled();
  });

  it("sets error message and returns false on 400 response", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: "Validation failed" }),
    });

    const { result } = renderHook(() => useCreateKudo());

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.submit(mockData);
    });

    expect(success).toBe(false);
    expect(result.current.error).toBe("Validation failed");
  });

  it("sets timeout error message on abort", async () => {
    const abortError = new DOMException("Aborted", "AbortError");
    global.fetch = vi.fn().mockRejectedValue(abortError);

    const { result } = renderHook(() => useCreateKudo());

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.submit(mockData);
    });

    expect(success).toBe(false);
    expect(result.current.error).toBe(
      "Kết nối quá chậm. Vui lòng thử lại.",
    );
  });
});
