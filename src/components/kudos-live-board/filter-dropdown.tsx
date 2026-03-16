"use client";

import { useState, useRef, useEffect, useCallback, useId } from "react";
import { Icon } from "@/components/ui/icon";

interface FilterOption {
	id: string;
	name: string;
}

interface FilterDropdownProps {
	label: string;
	options: FilterOption[];
	selected: string | null;
	onSelect: (id: string | null) => void;
}

export function FilterDropdown({
	label,
	options,
	selected,
	onSelect,
}: FilterDropdownProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [focusedIndex, setFocusedIndex] = useState(-1);
	const triggerId = useId();
	const triggerRef = useRef<HTMLButtonElement>(null);
	const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

	const selectedOption = options.find((o) => o.id === selected);

	const close = useCallback(() => {
		setIsOpen(false);
		setFocusedIndex(-1);
	}, []);

	// Close on outside click
	useEffect(() => {
		if (!isOpen) return;
		const handleClick = (e: MouseEvent) => {
			if (
				triggerRef.current &&
				!triggerRef.current.parentElement?.contains(e.target as Node)
			) {
				close();
			}
		};
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, [isOpen, close]);

	// Focus management
	useEffect(() => {
		if (isOpen && focusedIndex >= 0) {
			optionRefs.current[focusedIndex]?.focus();
		}
	}, [isOpen, focusedIndex]);

	function handleToggle() {
		if (isOpen) {
			close();
		} else {
			setIsOpen(true);
			setFocusedIndex(-1);
		}
	}

	function handleSelect(optionId: string) {
		if (optionId === selected) {
			onSelect(null);
		} else {
			onSelect(optionId);
		}
		close();
	}

	function handleListboxKeyDown(e: React.KeyboardEvent) {
		switch (e.key) {
			case "ArrowDown":
				e.preventDefault();
				setFocusedIndex((prev) => Math.min(prev + 1, options.length - 1));
				break;
			case "ArrowUp":
				e.preventDefault();
				setFocusedIndex((prev) => Math.max(prev - 1, 0));
				break;
			case "Enter":
				e.preventDefault();
				if (focusedIndex >= 0 && focusedIndex < options.length) {
					handleSelect(options[focusedIndex].id);
				}
				break;
			case "Escape":
				e.preventDefault();
				close();
				triggerRef.current?.focus();
				break;
			case "Tab":
				close();
				break;
		}
	}

	return (
		<div className="relative">
			<button
				ref={triggerRef}
				id={triggerId}
				type="button"
				aria-haspopup="listbox"
				aria-expanded={isOpen}
				onClick={handleToggle}
				className={[
					"flex items-center gap-2 px-4 py-2 rounded-lg border font-[family-name:var(--font-montserrat)] text-sm font-bold text-white",
					"transition-colors duration-150 ease-out",
					isOpen
						? "border-[var(--klb-color-accent-gold)]"
						: "border-[var(--klb-color-border-gold)]",
					"hover:border-[var(--klb-color-accent-gold)] cursor-pointer",
					"focus:outline-2 focus:outline-[var(--klb-color-accent-gold)] focus:outline-offset-2",
				].join(" ")}
			>
				<span>{label}</span>
				{selectedOption && !isOpen && (
					<span className="text-[var(--klb-color-accent-gold)]">
						{selectedOption.name}
					</span>
				)}
				<Icon
					name="chevron-down"
					size={16}
					className={[
						"transition-transform duration-150",
						isOpen ? "rotate-180" : "",
					].join(" ")}
				/>
			</button>

			{isOpen && (
				<ul
					role="listbox"
					aria-labelledby={triggerId}
					onKeyDown={handleListboxKeyDown}
					className="absolute top-full left-0 mt-1 min-w-full flex flex-col p-1.5 bg-[#00070C] border border-[var(--klb-color-border-gold)] rounded-lg z-50 transition-[opacity,transform] duration-150 ease-out origin-top"
				>
					{options.map((option, index) => (
						<li
							key={option.id}
							ref={(el) => {
								optionRefs.current[index] = el;
							}}
							role="option"
							aria-selected={selected === option.id}
							tabIndex={focusedIndex === index ? 0 : -1}
							onClick={() => handleSelect(option.id)}
							className={[
								"cursor-pointer px-4 py-2 rounded",
								"font-[family-name:var(--font-montserrat)] text-sm font-bold text-white",
								"hover:bg-[rgba(255,234,158,0.1)]",
								"transition-colors duration-150 ease-in-out",
								"outline-none focus-visible:outline-2 focus-visible:outline-[var(--klb-color-border-gold)] focus-visible:-outline-offset-2",
								selected === option.id
									? "bg-[rgba(255,234,158,0.2)]"
									: "",
							]
								.filter(Boolean)
								.join(" ")}
						>
							{option.name}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
