import { render, screen } from "@testing-library/react";
import { TopSunnerList } from "../top-sunner-list";

vi.mock("next/image", () => ({
	default: (props: Record<string, unknown>) => <img {...props} />,
}));

const mockItems = [
	{
		user_id: "u1",
		name: "Nguyễn Duy Khánh",
		avatar_url: "https://example.com/avatar1.png",
		gift_description: "Điểm thưởng +50",
	},
	{
		user_id: "u2",
		name: "Trần Minh Tú",
		avatar_url: null,
		gift_description: "Voucher 500k",
	},
	{
		user_id: "u3",
		name: "Lê Thanh Hải",
		avatar_url: "https://example.com/avatar3.png",
		gift_description: "Quà tặng đặc biệt",
	},
];

describe("TopSunnerList", () => {
	it("renders title", () => {
		render(
			<TopSunnerList
				title="10 SUNNER NHẬN QUÀ MỚI NHẤT"
				items={mockItems}
				emptyText="Chưa có dữ liệu"
			/>,
		);
		expect(
			screen.getByText("10 SUNNER NHẬN QUÀ MỚI NHẤT"),
		).toBeInTheDocument();
	});

	it("renders all list items with name and description", () => {
		render(
			<TopSunnerList
				title="10 SUNNER NHẬN QUÀ MỚI NHẤT"
				items={mockItems}
				emptyText="Chưa có dữ liệu"
			/>,
		);
		expect(screen.getByText("Nguyễn Duy Khánh")).toBeInTheDocument();
		expect(screen.getByText("Điểm thưởng +50")).toBeInTheDocument();
		expect(screen.getByText("Trần Minh Tú")).toBeInTheDocument();
		expect(screen.getByText("Voucher 500k")).toBeInTheDocument();
		expect(screen.getByText("Lê Thanh Hải")).toBeInTheDocument();
	});

	it("renders empty state when no items", () => {
		render(
			<TopSunnerList
				title="10 SUNNER NHẬN QUÀ MỚI NHẤT"
				items={[]}
				emptyText="Chưa có dữ liệu"
			/>,
		);
		expect(screen.getByText("Chưa có dữ liệu")).toBeInTheDocument();
	});

	it("renders list items as links to profiles", () => {
		render(
			<TopSunnerList
				title="10 SUNNER NHẬN QUÀ MỚI NHẤT"
				items={mockItems}
				emptyText="Chưa có dữ liệu"
			/>,
		);
		const links = screen.getAllByRole("link");
		expect(links).toHaveLength(3);
		expect(links[0]).toHaveAttribute("href", "/profile/u1");
	});

	it("shows initials when avatar_url is null", () => {
		render(
			<TopSunnerList
				title="10 SUNNER NHẬN QUÀ MỚI NHẤT"
				items={mockItems}
				emptyText="Chưa có dữ liệu"
			/>,
		);
		// For "Trần Minh Tú" with null avatar, should show initials "TM"
		expect(screen.getByText("TM")).toBeInTheDocument();
	});
});
