import { render, screen } from "@testing-library/react";
import { KudoPostCard } from "../kudo-post-card";
import type { Kudos } from "@/types/kudos";

// Mock Next.js modules
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

const mockKudos: Kudos = {
	id: "kudo-1",
	sender_id: "user-1",
	receiver_id: "user-2",
	content:
		"This is a very long kudos message that should be truncated after five lines of text to prevent the card from becoming too tall in the feed.",
	images: [
		"https://example.com/img1.jpg",
		"https://example.com/img2.jpg",
		"https://example.com/img3.jpg",
	],
	heart_count: 42,
	created_at: "2025-10-30T10:00:00Z",
	sender: {
		id: "user-1",
		name: "Nguyen Van A",
		avatar_url: "https://example.com/avatar1.jpg",
		department_name: "Engineering",
		kudos_received_count: 25,
	},
	receiver: {
		id: "user-2",
		name: "Tran Thi B",
		avatar_url: "https://example.com/avatar2.jpg",
		department_name: "Design",
		kudos_received_count: 15,
	},
	hashtags: [
		{ id: "h1", name: "#Dedicated" },
		{ id: "h2", name: "#Inspiring" },
	],
	is_liked_by_me: false,
};

describe("KudoPostCard", () => {
	it("renders sender info (name and department)", () => {
		render(
			<KudoPostCard kudos={mockKudos} currentUserId="user-3" lang="vi" />,
		);
		expect(screen.getByText("Nguyen Van A")).toBeInTheDocument();
		expect(screen.getByText("Engineering")).toBeInTheDocument();
	});

	it("renders receiver info (name and department)", () => {
		render(
			<KudoPostCard kudos={mockKudos} currentUserId="user-3" lang="vi" />,
		);
		expect(screen.getByText("Tran Thi B")).toBeInTheDocument();
		expect(screen.getByText("Design")).toBeInTheDocument();
	});

	it("renders timestamp in HH:mm - MM/DD/YYYY format", () => {
		render(
			<KudoPostCard kudos={mockKudos} currentUserId="user-3" lang="vi" />,
		);
		// 10:00 UTC → formatted as HH:mm - MM/DD/YYYY
		expect(screen.getByText(/10:00 - 10\/30\/2025/)).toBeInTheDocument();
	});

	it("renders kudos content", () => {
		render(
			<KudoPostCard kudos={mockKudos} currentUserId="user-3" lang="vi" />,
		);
		expect(screen.getByText(/This is a very long kudos/)).toBeInTheDocument();
	});

	it("applies 5-line truncation to content", () => {
		render(
			<KudoPostCard kudos={mockKudos} currentUserId="user-3" lang="vi" />,
		);
		const content = screen.getByText(/This is a very long kudos/);
		expect(content.className).toMatch(/line-clamp-5/);
	});

	it("renders hashtags", () => {
		render(
			<KudoPostCard kudos={mockKudos} currentUserId="user-3" lang="vi" />,
		);
		expect(screen.getByText("#Dedicated")).toBeInTheDocument();
		expect(screen.getByText("#Inspiring")).toBeInTheDocument();
	});

	it("renders heart count", () => {
		render(
			<KudoPostCard kudos={mockKudos} currentUserId="user-3" lang="vi" />,
		);
		expect(screen.getByText("42")).toBeInTheDocument();
	});

	it("renders images when present", () => {
		render(
			<KudoPostCard kudos={mockKudos} currentUserId="user-3" lang="vi" />,
		);
		// Gallery images are wrapped in links with target="_blank"
		const galleryLinks = screen
			.getAllByRole("link")
			.filter((el) => el.getAttribute("target") === "_blank");
		expect(galleryLinks).toHaveLength(3);
	});
});
