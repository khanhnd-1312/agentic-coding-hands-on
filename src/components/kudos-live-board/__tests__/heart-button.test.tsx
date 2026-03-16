import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HeartButton } from "../heart-button";

describe("HeartButton", () => {
	it("renders heart count", () => {
		render(
			<HeartButton
				kudosId="k1"
				initialIsLiked={false}
				initialHeartCount={42}
				isSender={false}
			/>,
		);
		expect(screen.getByText("42")).toBeInTheDocument();
	});

	it("toggles from inactive to active on click", async () => {
		const user = userEvent.setup();
		render(
			<HeartButton
				kudosId="k1"
				initialIsLiked={false}
				initialHeartCount={10}
				isSender={false}
			/>,
		);
		const button = screen.getByRole("button");
		await user.click(button);
		// Optimistic: count should increment
		expect(screen.getByText("11")).toBeInTheDocument();
	});

	it("toggles from active to inactive on click", async () => {
		const user = userEvent.setup();
		render(
			<HeartButton
				kudosId="k1"
				initialIsLiked={true}
				initialHeartCount={10}
				isSender={false}
			/>,
		);
		const button = screen.getByRole("button");
		await user.click(button);
		expect(screen.getByText("9")).toBeInTheDocument();
	});

	it("is disabled when isSender is true", () => {
		render(
			<HeartButton
				kudosId="k1"
				initialIsLiked={false}
				initialHeartCount={5}
				isSender={true}
			/>,
		);
		const button = screen.getByRole("button");
		expect(button).toHaveAttribute("aria-disabled", "true");
	});

	it("has correct aria-pressed state", () => {
		render(
			<HeartButton
				kudosId="k1"
				initialIsLiked={true}
				initialHeartCount={5}
				isSender={false}
			/>,
		);
		const button = screen.getByRole("button");
		expect(button).toHaveAttribute("aria-pressed", "true");
	});

	it("has aria-label for accessibility", () => {
		render(
			<HeartButton
				kudosId="k1"
				initialIsLiked={false}
				initialHeartCount={5}
				isSender={false}
			/>,
		);
		const button = screen.getByRole("button");
		expect(button).toHaveAttribute("aria-label", "Like kudos");
	});
});
