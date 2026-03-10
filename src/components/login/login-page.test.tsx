import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { LoginPage } from "./login-page";

// Mock next/image to avoid Next.js internals in test
vi.mock("next/image", () => ({
	default: ({ alt, ...props }: { alt: string; [key: string]: unknown }) => (
		// eslint-disable-next-line @next/next/no-img-element
		<img alt={alt} {...props} />
	),
}));

// Mock child components to isolate LoginPage structure tests
vi.mock("./login-button", () => ({
	LoginButton: ({ error, lang }: { error?: string; lang: string }) => (
		<div data-testid="login-button" data-error={error} data-lang={lang} />
	),
}));

vi.mock("./language-selector", () => ({
	LanguageSelector: ({ lang }: { lang: string }) => (
		<div data-testid="language-selector" data-lang={lang} />
	),
}));

describe("LoginPage", () => {
	it("renders header, main, and footer landmarks", () => {
		render(<LoginPage />);
		expect(screen.getByRole("banner")).toBeInTheDocument(); // <header>
		expect(screen.getByRole("main")).toBeInTheDocument();
		expect(screen.getByRole("contentinfo")).toBeInTheDocument(); // <footer>
	});

	it("propagates initialError to LoginButton", () => {
		render(<LoginPage initialError="auth_failed" />);
		const loginButton = screen.getByTestId("login-button");
		expect(loginButton).toHaveAttribute("data-error", "auth_failed");
	});

	it("propagates initialLang to LanguageSelector and LoginButton", () => {
		render(<LoginPage initialLang="en" />);
		expect(screen.getByTestId("language-selector")).toHaveAttribute(
			"data-lang",
			"en"
		);
		expect(screen.getByTestId("login-button")).toHaveAttribute(
			"data-lang",
			"en"
		);
	});

	it("defaults lang to 'vi' when initialLang is not provided", () => {
		render(<LoginPage />);
		expect(screen.getByTestId("language-selector")).toHaveAttribute(
			"data-lang",
			"vi"
		);
		expect(screen.getByTestId("login-button")).toHaveAttribute(
			"data-lang",
			"vi"
		);
	});
});
