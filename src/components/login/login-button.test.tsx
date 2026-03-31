import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LoginButton } from "./login-button";

// Mock supabase client
vi.mock("@/libs/supabase/client", () => ({
	createClient: vi.fn(),
}));

describe("LoginButton", () => {
	const mockOnError = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders label and Google icon in default state", () => {
		render(
			<LoginButton lang="vi" onError={mockOnError} />
		);
		expect(screen.getByText(/LOGIN With Google/i)).toBeInTheDocument();
		// Google icon rendered via Icon component
		const button = screen.getByRole("button");
		expect(button).toBeInTheDocument();
		expect(button).not.toHaveAttribute("aria-busy");
		expect(button).not.toHaveAttribute("aria-disabled");
	});

	it("calls signInWithOAuth and sets loading state on click", async () => {
		const mockSignIn = vi.fn(() => new Promise(() => {})); // never resolves — keeps loading state
		const { createClient } = await import("@/libs/supabase/client");
		vi.mocked(createClient).mockReturnValue({
			auth: { signInWithOAuth: mockSignIn },
		} as never);

		render(<LoginButton lang="vi" onError={mockOnError} />);
		const button = screen.getByRole("button");
		fireEvent.click(button);

		await waitFor(() => {
			expect(button).toHaveAttribute("aria-busy", "true");
			expect(button).toHaveAttribute("aria-disabled", "true");
		});
	});

	it("shows spinner and loading label in loading state", async () => {
		const mockSignIn = vi.fn(() => new Promise(() => {})); // never resolves
		const { createClient } = await import("@/libs/supabase/client");
		vi.mocked(createClient).mockReturnValue({
			auth: { signInWithOAuth: mockSignIn },
		} as never);

		render(<LoginButton lang="vi" onError={mockOnError} />);
		fireEvent.click(screen.getByRole("button"));

		await waitFor(() => {
			expect(screen.getByText(/Đang đăng nhập/i)).toBeInTheDocument();
		});
	});

	it("renders error alert with retry link when error prop provided", () => {
		render(
			<LoginButton lang="vi" error="auth_failed" onError={mockOnError} />
		);
		const alert = screen.getByRole("alert");
		expect(alert).toBeInTheDocument();
		const retryLink = screen.getByRole("link");
		expect(retryLink).toBeInTheDocument();
	});

	it("uses Vietnamese aria-label when lang is vi", () => {
		render(<LoginButton lang="vi" onError={mockOnError} />);
		const button = screen.getByRole("button");
		expect(button).toHaveAttribute("aria-label", "Đăng nhập bằng Google");
	});

	it("uses English aria-label when lang is en", () => {
		render(<LoginButton lang="en" onError={mockOnError} />);
		const button = screen.getByRole("button");
		expect(button).toHaveAttribute("aria-label", "Sign in with Google");
	});
});
