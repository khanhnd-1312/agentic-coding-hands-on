import { render, screen } from "@testing-library/react";
import { UserInfoBlock } from "../user-info-block";

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

describe("UserInfoBlock", () => {
	it("renders user name", () => {
		render(
			<UserInfoBlock
				user={{
					id: "u1",
					name: "Nguyen Van A",
					avatar_url: "https://example.com/avatar.jpg",
					department_name: "Engineering",
					kudos_received_count: 25,
				}}
			/>,
		);
		expect(screen.getByText("Nguyen Van A")).toBeInTheDocument();
	});

	it("renders department name", () => {
		render(
			<UserInfoBlock
				user={{
					id: "u1",
					name: "Nguyen Van A",
					avatar_url: null,
					department_name: "Engineering",
					kudos_received_count: 10,
				}}
			/>,
		);
		expect(screen.getByText("Engineering")).toBeInTheDocument();
	});

	it("renders avatar image", () => {
		render(
			<UserInfoBlock
				user={{
					id: "u1",
					name: "Nguyen Van A",
					avatar_url: "https://example.com/avatar.jpg",
					department_name: "Engineering",
					kudos_received_count: 5,
				}}
			/>,
		);
		const avatar = screen.getByAltText("Nguyen Van A");
		expect(avatar).toBeInTheDocument();
	});

	it("renders initials fallback when avatar_url is null", () => {
		render(
			<UserInfoBlock
				user={{
					id: "u1",
					name: "Nguyen Van A",
					avatar_url: null,
					department_name: "Engineering",
					kudos_received_count: 5,
				}}
			/>,
		);
		// Should render initials when no avatar — look for the initials container
		const initialsEl = screen.getByText("N");
		expect(initialsEl).toBeInTheDocument();
		expect(initialsEl.closest("div")).toHaveClass("rounded-full");
	});

	it("renders star count for users with 10+ kudos received (1 star)", () => {
		render(
			<UserInfoBlock
				user={{
					id: "u1",
					name: "Test User",
					avatar_url: null,
					department_name: "Dept",
					kudos_received_count: 10,
				}}
			/>,
		);
		expect(screen.getByText("★")).toBeInTheDocument();
	});

	it("renders 2 stars for users with 20+ kudos received", () => {
		render(
			<UserInfoBlock
				user={{
					id: "u1",
					name: "Test User",
					avatar_url: null,
					department_name: "Dept",
					kudos_received_count: 25,
				}}
			/>,
		);
		expect(screen.getByText("★★")).toBeInTheDocument();
	});

	it("renders 3 stars for users with 50+ kudos received", () => {
		render(
			<UserInfoBlock
				user={{
					id: "u1",
					name: "Test User",
					avatar_url: null,
					department_name: "Dept",
					kudos_received_count: 55,
				}}
			/>,
		);
		expect(screen.getByText("★★★")).toBeInTheDocument();
	});

	it("renders no stars for users with <10 kudos received", () => {
		render(
			<UserInfoBlock
				user={{
					id: "u1",
					name: "Test User",
					avatar_url: null,
					department_name: "Dept",
					kudos_received_count: 5,
				}}
			/>,
		);
		expect(screen.queryByText(/★/)).not.toBeInTheDocument();
	});

	it("wraps name in a link to profile page", () => {
		render(
			<UserInfoBlock
				user={{
					id: "u1",
					name: "Nguyen Van A",
					avatar_url: "https://example.com/avatar.jpg",
					department_name: "Engineering",
					kudos_received_count: 25,
				}}
			/>,
		);
		const links = screen.getAllByRole("link", { name: /Nguyen Van A/i });
		// Both avatar link and name link point to profile
		const nameLink = links.find((el) => el.textContent?.includes("Nguyen Van A") && !el.querySelector("img"));
		expect(nameLink).toHaveAttribute("href", "/profile/u1");
	});

	it("wraps avatar in a link to profile page", () => {
		render(
			<UserInfoBlock
				user={{
					id: "u1",
					name: "Nguyen Van A",
					avatar_url: "https://example.com/avatar.jpg",
					department_name: "Engineering",
					kudos_received_count: 25,
				}}
			/>,
		);
		const img = screen.getByAltText("Nguyen Van A");
		const link = img.closest("a");
		expect(link).toHaveAttribute("href", "/profile/u1");
	});
});
