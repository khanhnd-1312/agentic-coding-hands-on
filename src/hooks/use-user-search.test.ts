import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useUserSearch } from "@/hooks/use-user-search";

describe("useUserSearch", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("has correct initial state", () => {
    const { result } = renderHook(() => useUserSearch());
    expect(result.current.query).toBe("");
    expect(result.current.results).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it("sets isLoading to true after setQuery", () => {
    const { result } = renderHook(() => useUserSearch());
    act(() => {
      result.current.setQuery("test");
    });
    expect(result.current.isLoading).toBe(true);
  });

  it("calls fetch with correct URL after 300ms debounce", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
    });

    const { result } = renderHook(() => useUserSearch());
    act(() => {
      result.current.setQuery("test");
    });

    expect(global.fetch).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/users/search?q=test",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("sets results from response data array", async () => {
    const mockUsers = [
      { id: "1", name: "Alice", avatar_url: null, department_name: "Eng" },
    ];
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockUsers }),
    });

    const { result } = renderHook(() => useUserSearch());
    act(() => {
      result.current.setQuery("alice");
    });

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.results).toEqual(mockUsers);
    expect(result.current.isLoading).toBe(false);
  });

  it("clears results immediately on empty query", async () => {
    const mockUsers = [
      { id: "1", name: "Alice", avatar_url: null, department_name: "Eng" },
    ];
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockUsers }),
    });

    const { result } = renderHook(() => useUserSearch());

    act(() => {
      result.current.setQuery("alice");
    });
    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current.results).toEqual(mockUsers);

    act(() => {
      result.current.setQuery("");
    });
    expect(result.current.results).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });
});
