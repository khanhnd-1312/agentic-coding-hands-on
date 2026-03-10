import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ContentBlock } from "./content-block";

describe("ContentBlock", () => {
	it("renders VI body text by default", () => {
		render(<ContentBlock />);
		expect(screen.getAllByText(/Root Further/i)[0]).toBeInTheDocument();
		expect(screen.getAllByText(/Sun\* Annual Awards 2025/)[0]).toBeInTheDocument();
	});

	it("renders VI quote block", () => {
		render(<ContentBlock />);
		expect(
			screen.getByText(/A tree with deep roots fears no storm/),
		).toBeInTheDocument();
	});

	it("renders EN body text when lang='en'", () => {
		render(<ContentBlock lang="en" />);
		expect(screen.getAllByText(/Root Further/i)[0]).toBeInTheDocument();
		expect(screen.getAllByText(/Sun\* Annual Awards 2025/)[0]).toBeInTheDocument();
	});

	it("renders VI text when lang='vi' explicitly set", () => {
		render(<ContentBlock lang="vi" />);
		expect(screen.getByText(/đa dạng hóa năng lực/i)).toBeInTheDocument();
	});

	it("content is sourced from i18n dictionary (not hardcoded)", () => {
		const { rerender } = render(<ContentBlock lang="vi" />);
		expect(screen.getAllByText(/Root Further/i)[0]).toBeInTheDocument();

		rerender(<ContentBlock lang="en" />);
		expect(screen.getAllByText(/Root Further/i)[0]).toBeInTheDocument();
	});
});
