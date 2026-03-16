import { render, screen, fireEvent } from "@testing-library/react";
import { HeroBanner } from "../hero-banner";

vi.mock("next/image", () => ({
	default: (props: Record<string, unknown>) => {
		const { onError, ...rest } = props;
		return (
			<img
				{...rest}
				data-testid="hero-image"
				onError={onError as React.ReactEventHandler<HTMLImageElement>}
			/>
		);
	},
}));

const defaultDict = {
	hero: {
		subtitle: "Hệ thống ghi nhận và cảm ơn",
		logo: "KUDOS",
		searchPlaceholder:
			"Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?",
		profileSearch: "Tìm Sunner",
	},
} as Parameters<typeof HeroBanner>[0]["dict"];

describe("HeroBanner", () => {
	it("renders title text", () => {
		render(<HeroBanner dict={defaultDict} />);
		expect(
			screen.getByText("Hệ thống ghi nhận và cảm ơn"),
		).toBeInTheDocument();
	});

	it("renders KUDOS logo text", () => {
		render(<HeroBanner dict={defaultDict} />);
		expect(screen.getByText("KUDOS")).toBeInTheDocument();
	});

	it("renders background image", () => {
		render(<HeroBanner dict={defaultDict} />);
		const img = screen.getByTestId("hero-image");
		expect(img).toBeInTheDocument();
	});

	it("falls back to solid gradient on image error", () => {
		render(<HeroBanner dict={defaultDict} />);
		const img = screen.getByTestId("hero-image");
		fireEvent.error(img);
		expect(screen.queryByTestId("hero-image")).not.toBeInTheDocument();
	});
});
