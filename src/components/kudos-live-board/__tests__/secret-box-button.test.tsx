import { render, screen, fireEvent } from "@testing-library/react";
import { SecretBoxButton } from "../secret-box-button";

describe("SecretBoxButton", () => {
	it("renders button text", () => {
		render(
			<SecretBoxButton
				label="Mở Secret Box 🎁"
				unopenedCount={3}
				onClick={vi.fn()}
			/>,
		);
		expect(screen.getByText("Mở Secret Box 🎁")).toBeInTheDocument();
	});

	it("calls onClick when clicked", () => {
		const onClick = vi.fn();
		render(
			<SecretBoxButton label="Mở Secret Box 🎁" unopenedCount={3} onClick={onClick} />,
		);
		fireEvent.click(screen.getByRole("button"));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("is disabled when unopenedCount is 0", () => {
		render(
			<SecretBoxButton
				label="Mở Secret Box 🎁"
				unopenedCount={0}
				onClick={vi.fn()}
			/>,
		);
		const button = screen.getByRole("button");
		expect(button).toBeDisabled();
		expect(button).toHaveAttribute("aria-disabled", "true");
	});

	it("does not call onClick when disabled", () => {
		const onClick = vi.fn();
		render(
			<SecretBoxButton label="Mở Secret Box 🎁" unopenedCount={0} onClick={onClick} />,
		);
		fireEvent.click(screen.getByRole("button"));
		expect(onClick).not.toHaveBeenCalled();
	});

	it("has correct styling when enabled", () => {
		render(
			<SecretBoxButton label="Mở Secret Box 🎁" unopenedCount={1} onClick={vi.fn()} />,
		);
		const button = screen.getByRole("button");
		expect(button.className).toContain("cursor-pointer");
	});
});
