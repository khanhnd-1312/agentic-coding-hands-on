import { render, screen } from "@testing-library/react";
import { SpotlightSection } from "../spotlight-section";
import type { SpotlightResponse } from "@/types/kudos";
import type { KudosLiveBoardDictionary } from "@/i18n/kudos-live-board";

const mockDict = {
	spotlight: {
		caption: "Sun* Annual Awards 2025",
		title: "SPOTLIGHT BOARD",
		searchPlaceholder: "Tìm kiếm tên...",
		panZoomTooltip: "Pan/Zoom",
		empty: "Chưa có dữ liệu",
	},
} as KudosLiveBoardDictionary;

const mockData: SpotlightResponse = {
	total_kudos: 388,
	entries: [
		{ name: "Nguyễn Duy Khánh", user_id: "u1", kudos_count: 50 },
		{ name: "Trần Minh Tú", user_id: "u2", kudos_count: 30 },
		{ name: "Lê Thanh Hải", user_id: "u3", kudos_count: 20 },
	],
};

describe("SpotlightSection", () => {
	it("renders section title", () => {
		render(
			<SpotlightSection data={mockData} dict={mockDict} isLoading={false} />,
		);
		expect(screen.getByText("SPOTLIGHT BOARD")).toBeInTheDocument();
		expect(
			screen.getByText("Sun* Annual Awards 2025"),
		).toBeInTheDocument();
	});

	it("renders total kudos count header", () => {
		render(
			<SpotlightSection data={mockData} dict={mockDict} isLoading={false} />,
		);
		expect(screen.getByText("388 KUDOS")).toBeInTheDocument();
	});

	it("renders loading state", () => {
		render(
			<SpotlightSection data={null} dict={mockDict} isLoading={true} />,
		);
		expect(screen.getByRole("status")).toBeInTheDocument();
	});

	it("renders empty state when no entries", () => {
		const emptyData: SpotlightResponse = { total_kudos: 0, entries: [] };
		render(
			<SpotlightSection
				data={emptyData}
				dict={mockDict}
				isLoading={false}
			/>,
		);
		expect(screen.getByText("Chưa có dữ liệu")).toBeInTheDocument();
	});

	it("renders SpotlightBoard when data exists", () => {
		render(
			<SpotlightSection data={mockData} dict={mockDict} isLoading={false} />,
		);
		expect(
			screen.getByLabelText(
				"Spotlight Board — interactive word cloud of kudos recipients",
			),
		).toBeInTheDocument();
	});
});
