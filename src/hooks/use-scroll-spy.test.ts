import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useScrollSpy } from "./use-scroll-spy";

describe("useScrollSpy", () => {
	let mockObserve: ReturnType<typeof vi.fn>;
	let mockDisconnect: ReturnType<typeof vi.fn>;
	let triggerIntersection: (
		entries: Partial<IntersectionObserverEntry>[]
	) => void;

	beforeEach(() => {
		mockObserve = vi.fn();
		mockDisconnect = vi.fn();

		let storedCallback: IntersectionObserverCallback;

		const MockIntersectionObserver = class {
			constructor(callback: IntersectionObserverCallback) {
				storedCallback = callback;
			}
			observe = mockObserve;
			unobserve = vi.fn();
			disconnect = mockDisconnect;
			takeRecords = vi.fn().mockReturnValue([]);
			root = null;
			rootMargin = "";
			thresholds = [] as number[];
		};

		vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

		triggerIntersection = (entries) => {
			storedCallback(
				entries as IntersectionObserverEntry[],
				{} as IntersectionObserver
			);
		};

		// Create mock DOM elements for each section
		for (const id of [
			"top-talent",
			"top-project",
			"top-project-leader",
			"best-manager",
			"signature-creator",
			"mvp",
		]) {
			const el = document.createElement("section");
			el.id = id;
			document.body.appendChild(el);
		}
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		document.body.innerHTML = "";
	});

	const sectionIds = [
		"top-talent",
		"top-project",
		"top-project-leader",
		"best-manager",
		"signature-creator",
		"mvp",
	];

	it("returns first sectionId on mount", () => {
		const { result } = renderHook(() => useScrollSpy(sectionIds));
		expect(result.current).toBe("top-talent");
	});

	it("updates activeId when IntersectionObserver fires a new section", () => {
		const { result } = renderHook(() => useScrollSpy(sectionIds));

		act(() => {
			triggerIntersection([
				{
					target: document.getElementById("top-project")!,
					isIntersecting: true,
				},
			]);
		});

		expect(result.current).toBe("top-project");
	});

	it("keeps last activeId when observer fires with zero intersecting entries", () => {
		const { result } = renderHook(() => useScrollSpy(sectionIds));

		// First, set active to mvp
		act(() => {
			triggerIntersection([
				{
					target: document.getElementById("mvp")!,
					isIntersecting: true,
				},
			]);
		});
		expect(result.current).toBe("mvp");

		// Then fire with no intersecting entries
		act(() => {
			triggerIntersection([
				{
					target: document.getElementById("mvp")!,
					isIntersecting: false,
				},
			]);
		});

		// Should keep mvp active (not reset to null or first item)
		expect(result.current).toBe("mvp");
	});
});
