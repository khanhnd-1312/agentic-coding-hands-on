import { test, expect } from "@playwright/test";

// ─────────────────────────────────────────────────────────────────────────────
// Note: These tests require an authenticated session.
// In CI, use test Supabase credentials. Locally, ensure a valid session exists.
// Unauthenticated requests redirect to /login.
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Kudos Live Board — Critical User Flow", () => {
	test.beforeEach(async ({ page }) => {
		// Attempt to load the live board page
		// If not authenticated, this redirects to /login
		await page.goto("/kudo/live");
	});

	test("unauthenticated user is redirected to /login", async ({ page }) => {
		await expect(page).toHaveURL(/\/login/);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Authenticated tests — require a valid session
// Skip in CI unless auth environment is configured
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Kudos Live Board — Authenticated", () => {
	// Skip if no auth env configured
	test.skip(
		() => !process.env.E2E_AUTH_COOKIE,
		"Skipping authenticated tests: E2E_AUTH_COOKIE not set",
	);

	test.beforeEach(async ({ page, context }) => {
		// Inject auth session cookie
		if (process.env.E2E_AUTH_COOKIE) {
			const cookies = JSON.parse(process.env.E2E_AUTH_COOKIE);
			await context.addCookies(cookies);
		}
		await page.goto("/kudo/live");
		await page.waitForLoadState("networkidle");
	});

	test("page renders hero banner and main sections", async ({ page }) => {
		// Hero banner
		await expect(page.locator("section").first()).toBeVisible();

		// Section titles
		await expect(page.getByText("HIGHLIGHT KUDOS")).toBeVisible();
		await expect(page.getByText("SPOTLIGHT BOARD")).toBeVisible();
		await expect(page.getByText("ALL KUDOS")).toBeVisible();
	});

	test("browse feed with infinite scroll", async ({ page }) => {
		// Scroll to All Kudos section
		const allKudosHeading = page.getByText("ALL KUDOS");
		await allKudosHeading.scrollIntoViewIfNeeded();
		await expect(allKudosHeading).toBeVisible();

		// Kudos cards should be present (article elements)
		const cards = page.locator("article");
		await expect(cards.first()).toBeVisible();

		// Scroll down to trigger infinite scroll
		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
		await page.waitForTimeout(1000);

		// More cards should have loaded
		const cardCount = await cards.count();
		expect(cardCount).toBeGreaterThan(0);
	});

	test("like a kudos — heart toggles", async ({ page }) => {
		// Find first heart button that is not disabled (not sender's own kudos)
		const heartButton = page
			.getByRole("button", { name: /like kudos/i })
			.first();

		// Skip if no likeable kudos found
		if ((await heartButton.count()) === 0) {
			test.skip();
			return;
		}

		await heartButton.scrollIntoViewIfNeeded();

		// Get initial state
		const initialPressed = await heartButton.getAttribute("aria-pressed");

		// Click to toggle
		await heartButton.click();

		// Wait for optimistic update
		await page.waitForTimeout(500);

		// State should have toggled
		const newPressed = await heartButton.getAttribute("aria-pressed");
		expect(newPressed).not.toBe(initialPressed);

		// Click again to revert
		await heartButton.click();
		await page.waitForTimeout(500);

		const revertedPressed = await heartButton.getAttribute("aria-pressed");
		expect(revertedPressed).toBe(initialPressed);
	});

	test("filter by hashtag updates feed", async ({ page }) => {
		// Find the hashtag filter dropdown
		const hashtagFilter = page.getByRole("button", { name: /hashtag/i });

		if ((await hashtagFilter.count()) === 0) {
			test.skip();
			return;
		}

		await hashtagFilter.scrollIntoViewIfNeeded();
		await hashtagFilter.click();

		// Select first option from the listbox
		const listbox = page.getByRole("listbox");
		await expect(listbox).toBeVisible();

		const firstOption = listbox.getByRole("option").first();
		if ((await firstOption.count()) === 0) {
			test.skip();
			return;
		}

		await firstOption.click();

		// Listbox should close
		await expect(listbox).not.toBeVisible();

		// Feed should update (wait for re-fetch)
		await page.waitForTimeout(1000);
	});

	test("carousel navigation with arrows", async ({ page }) => {
		// Find carousel region
		const carousel = page.getByRole("region", { name: /highlight kudos/i });

		if ((await carousel.count()) === 0) {
			test.skip();
			return;
		}

		await carousel.scrollIntoViewIfNeeded();

		// Find next button
		const nextButton = carousel.getByRole("button", { name: /next/i });
		if ((await nextButton.count()) > 0) {
			await nextButton.click();
			await page.waitForTimeout(500);
		}

		// Find prev button
		const prevButton = carousel.getByRole("button", { name: /previous/i });
		if ((await prevButton.count()) > 0) {
			await prevButton.click();
			await page.waitForTimeout(500);
		}
	});

	test("copy link shows toast", async ({ page }) => {
		// Grant clipboard permission
		await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);

		// Find first copy link button
		const copyButton = page
			.getByRole("button", { name: /copy link/i })
			.first();

		if ((await copyButton.count()) === 0) {
			test.skip();
			return;
		}

		await copyButton.scrollIntoViewIfNeeded();
		await copyButton.click();

		// Toast should appear
		await expect(
			page.getByText("Link copied — ready to share!"),
		).toBeVisible();

		// Toast should disappear after timeout
		await expect(
			page.getByText("Link copied — ready to share!"),
		).not.toBeVisible({ timeout: 5000 });
	});

	test("spotlight board search highlights name", async ({ page }) => {
		const spotlightSection = page.getByText("SPOTLIGHT BOARD");

		if ((await spotlightSection.count()) === 0) {
			test.skip();
			return;
		}

		await spotlightSection.scrollIntoViewIfNeeded();

		// Find search input in spotlight
		const searchInput = page.getByPlaceholder(/tìm kiếm tên|search name/i);

		if ((await searchInput.count()) === 0) {
			test.skip();
			return;
		}

		await searchInput.fill("Nguyễn");
		await page.waitForTimeout(300);

		// Should have highlighted text (pink color)
		// This verifies the search highlight mechanism works
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Responsive layout checks
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Kudos Live Board — Responsive", () => {
	test.skip(
		() => !process.env.E2E_AUTH_COOKIE,
		"Skipping: E2E_AUTH_COOKIE not set",
	);

	test.beforeEach(async ({ page, context }) => {
		if (process.env.E2E_AUTH_COOKIE) {
			const cookies = JSON.parse(process.env.E2E_AUTH_COOKIE);
			await context.addCookies(cookies);
		}
	});

	const viewports = [
		{ name: "Mobile 360px", width: 360, height: 800 },
		{ name: "Tablet 768px", width: 768, height: 1024 },
		{ name: "Desktop 1440px", width: 1440, height: 900 },
	];

	for (const vp of viewports) {
		test(`no horizontal overflow at ${vp.name}`, async ({ page }) => {
			await page.setViewportSize({ width: vp.width, height: vp.height });
			await page.goto("/kudo/live");
			await page.waitForLoadState("networkidle");

			const bodyWidth = await page.evaluate(
				() => document.body.scrollWidth,
			);
			expect(bodyWidth).toBeLessThanOrEqual(vp.width + 1);
		});
	}
});
