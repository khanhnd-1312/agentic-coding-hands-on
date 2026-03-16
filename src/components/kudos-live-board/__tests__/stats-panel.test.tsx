import { render, screen } from "@testing-library/react";
import { StatsPanel } from "../stats-panel";

const mockStats = {
	kudos_received: 25,
	kudos_sent: 18,
	hearts_received: 42,
	secret_boxes_opened: 5,
	secret_boxes_unopened: 3,
};

const defaultLabels = {
	kudosReceived: "Số Kudos bạn nhận được:",
	kudosSent: "Số Kudos bạn đã gửi:",
	heartsReceived: "Số tim bạn nhận được:",
	secretBoxOpened: "Số Secret Box bạn đã mở:",
	secretBoxUnopened: "Số Secret Box chưa mở:",
};

describe("StatsPanel", () => {
	it("renders all 6 stat labels", () => {
		render(<StatsPanel stats={mockStats} labels={defaultLabels} />);
		expect(
			screen.getByText("Số Kudos bạn nhận được:"),
		).toBeInTheDocument();
		expect(screen.getByText("Số Kudos bạn đã gửi:")).toBeInTheDocument();
		expect(screen.getByText("Số tim bạn nhận được:")).toBeInTheDocument();
		expect(
			screen.getByText("Số Secret Box bạn đã mở:"),
		).toBeInTheDocument();
		expect(screen.getByText("Số Secret Box chưa mở:")).toBeInTheDocument();
	});

	it("renders stat values correctly", () => {
		render(<StatsPanel stats={mockStats} labels={defaultLabels} />);
		expect(screen.getByText("25")).toBeInTheDocument();
		expect(screen.getByText("18")).toBeInTheDocument();
		expect(screen.getByText("42")).toBeInTheDocument();
		expect(screen.getByText("5")).toBeInTheDocument();
		expect(screen.getByText("3")).toBeInTheDocument();
	});

	it("renders separator between hearts and secret box rows", () => {
		const { container } = render(
			<StatsPanel stats={mockStats} labels={defaultLabels} />,
		);
		const separator = container.querySelector("[role='separator']");
		expect(separator).toBeInTheDocument();
	});

	it("renders zero values correctly", () => {
		const zeroStats = {
			kudos_received: 0,
			kudos_sent: 0,
			hearts_received: 0,
			secret_boxes_opened: 0,
			secret_boxes_unopened: 0,
		};
		render(<StatsPanel stats={zeroStats} labels={defaultLabels} />);
		const zeros = screen.getAllByText("0");
		expect(zeros).toHaveLength(5);
	});
});
