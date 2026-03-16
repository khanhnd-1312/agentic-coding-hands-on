import { render, screen, fireEvent } from "@testing-library/react";
import { KudosCarousel } from "../kudos-carousel";
import type { Kudos } from "@/types/kudos";

vi.mock("next/image", () => ({
	default: (props: Record<string, unknown>) => <img {...props} />,
}));
vi.mock("next/link", () => ({
	default: ({
		children,
		href,
	}: {
		children: React.ReactNode;
		href: string;
	}) => <a href={href}>{children}</a>,
}));

function createMockKudos(id: string): Kudos {
	return {
		id,
		sender_id: "user-1",
		receiver_id: "user-2",
		content: `Kudos message for ${id}`,
		images: [],
		heart_count: 10,
		created_at: "2025-10-30T10:00:00Z",
		sender: {
			id: "user-1",
			name: "Sender",
			avatar_url: null,
			department_name: "Eng",
			kudos_received_count: 10,
		},
		receiver: {
			id: "user-2",
			name: "Receiver",
			avatar_url: null,
			department_name: "Design",
			kudos_received_count: 5,
		},
		hashtags: [{ id: "h1", name: "#Test" }],
		is_liked_by_me: false,
	};
}

const mockHighlights: Kudos[] = Array.from({ length: 5 }, (_, i) =>
	createMockKudos(`kudo-${i + 1}`),
);

describe("KudosCarousel", () => {
	it("renders pagination indicator showing 1/5 initially", () => {
		render(
			<KudosCarousel
				highlights={mockHighlights}
				currentUserId="user-3"
				lang="vi"
			/>,
		);
		expect(screen.getByText("1/5")).toBeInTheDocument();
	});

	it("prev button is disabled at slide 1", () => {
		render(
			<KudosCarousel
				highlights={mockHighlights}
				currentUserId="user-3"
				lang="vi"
			/>,
		);
		const prevButtons = screen.getAllByLabelText("Previous slide");
		expect(prevButtons[0]).toHaveAttribute("aria-disabled", "true");
	});

	it("clicking next updates pagination to 2/5", () => {
		render(
			<KudosCarousel
				highlights={mockHighlights}
				currentUserId="user-3"
				lang="vi"
			/>,
		);
		const nextButtons = screen.getAllByLabelText("Next slide");
		fireEvent.click(nextButtons[0]);
		expect(screen.getByText("2/5")).toBeInTheDocument();
	});

	it("next button is disabled at last slide", () => {
		render(
			<KudosCarousel
				highlights={mockHighlights}
				currentUserId="user-3"
				lang="vi"
			/>,
		);
		const nextButtons = screen.getAllByLabelText("Next slide");
		// Navigate to last slide
		for (let i = 0; i < 4; i++) {
			fireEvent.click(nextButtons[0]);
		}
		expect(screen.getByText("5/5")).toBeInTheDocument();
		expect(nextButtons[0]).toHaveAttribute("aria-disabled", "true");
	});

	it("supports keyboard navigation with ArrowRight/ArrowLeft", () => {
		render(
			<KudosCarousel
				highlights={mockHighlights}
				currentUserId="user-3"
				lang="vi"
			/>,
		);
		const carousel = screen.getByRole("region");
		fireEvent.keyDown(carousel, { key: "ArrowRight" });
		expect(screen.getByText("2/5")).toBeInTheDocument();

		fireEvent.keyDown(carousel, { key: "ArrowLeft" });
		expect(screen.getByText("1/5")).toBeInTheDocument();
	});

	it("has correct ARIA attributes", () => {
		render(
			<KudosCarousel
				highlights={mockHighlights}
				currentUserId="user-3"
				lang="vi"
			/>,
		);
		const carousel = screen.getByRole("region");
		expect(carousel).toHaveAttribute("aria-roledescription", "carousel");
		expect(carousel).toHaveAttribute("aria-label", "Highlight Kudos");
	});
});
