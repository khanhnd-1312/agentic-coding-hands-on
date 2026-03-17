import { render, screen } from "@testing-library/react";
import { HighlightKudoCard } from "../highlight-kudo-card";
import type { Kudos } from "@/types/kudos";

function tiptapDoc(text: string) {
	return { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text }] }] };
}

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
	title: "",
	is_anonymous: false,
	content:
		tiptapDoc("This is a very long highlight kudos message that should be truncated after three lines of text to keep the card compact in the carousel view."),
	images: [],
	heart_count: 100,
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

describe("HighlightKudoCard", () => {
	it("renders sender and receiver names", () => {
		render(
			<HighlightKudoCard
				kudos={mockKudos}
				currentUserId="user-3"
				lang="vi"
			/>,
		);
		expect(screen.getByText("Nguyen Van A")).toBeInTheDocument();
		expect(screen.getByText("Tran Thi B")).toBeInTheDocument();
	});

	it("renders content with 3-line truncation", () => {
		render(
			<HighlightKudoCard
				kudos={mockKudos}
				currentUserId="user-3"
				lang="vi"
			/>,
		);
		const content = screen.getByText(/This is a very long highlight/);
		expect(content.className).toMatch(/line-clamp-3/);
	});

	it("renders first hashtag as category label and remaining as hashtags", () => {
		render(
			<HighlightKudoCard
				kudos={mockKudos}
				currentUserId="user-3"
				lang="vi"
			/>,
		);
		// First hashtag becomes category label (without #, visually uppercased via CSS)
		expect(screen.getByText("Dedicated")).toBeInTheDocument();
		// Second hashtag rendered as clickable hashtag
		expect(screen.getByText("#Inspiring")).toBeInTheDocument();
	});

	it("renders heart count", () => {
		render(
			<HighlightKudoCard
				kudos={mockKudos}
				currentUserId="user-3"
				lang="vi"
			/>,
		);
		expect(screen.getByText("100")).toBeInTheDocument();
	});

	it('renders "Xem chi tiết" link to detail page', () => {
		render(
			<HighlightKudoCard
				kudos={mockKudos}
				currentUserId="user-3"
				lang="vi"
			/>,
		);
		const detailLink = screen.getByText("Xem chi tiết");
		expect(detailLink).toBeInTheDocument();
		expect(detailLink.closest("a")).toHaveAttribute("href", "/kudo/kudo-1");
	});

	it("card body links to detail page", () => {
		render(
			<HighlightKudoCard
				kudos={mockKudos}
				currentUserId="user-3"
				lang="vi"
			/>,
		);
		const contentLink = screen.getByText(/This is a very long highlight/).closest("a");
		expect(contentLink).toHaveAttribute("href", "/kudo/kudo-1");
	});
});
