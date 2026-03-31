"use client";

import { useState, useEffect, useCallback, useId, useRef } from "react";
import { Icon } from "@/components/ui/icon";
import type { LanguagePreference } from "@/types/login";

interface LanguageSelectorProps {
	lang: LanguagePreference;
	onLangChange: (lang: LanguagePreference) => void;
	/** Controlled mode: when provided, the parent controls open/close state */
	isOpen?: boolean;
	/** Controlled mode: callback when dropdown wants to toggle */
	onToggle?: (open: boolean) => void;
}

const LANG_OPTIONS = [
	{ value: "vi" as const, label: "VN", flag: "flag-vn" as const },
	{ value: "en" as const, label: "EN", flag: "flag-en" as const },
];

export function LanguageSelector({ lang, onLangChange, isOpen: controlledIsOpen, onToggle }: LanguageSelectorProps) {
	const [internalIsOpen, setInternalIsOpen] = useState(false);
	const isControlled = controlledIsOpen !== undefined;
	const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
	const setIsOpen = isControlled
		? (value: boolean | ((prev: boolean) => boolean)) => {
				const next = typeof value === "function" ? value(isOpen) : value;
				onToggle?.(next);
			}
		: setInternalIsOpen;
	const [focusedIndex, setFocusedIndex] = useState(-1);
	const currentOption = LANG_OPTIONS.find((o) => o.value === lang)!;
	const triggerId = useId();
	const triggerRef = useRef<HTMLButtonElement>(null);
	const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

	const close = useCallback(() => {
		setIsOpen(false);
		setFocusedIndex(-1);
	}, []);

	// Close on Escape (document-level for backdrop case)
	useEffect(() => {
		if (!isOpen) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				close();
				triggerRef.current?.focus();
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, close]);

	// Close on scroll
	useEffect(() => {
		if (!isOpen) return;
		const handleScroll = () => close();
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [isOpen, close]);

	// Focus management: focus the option when focusedIndex changes
	useEffect(() => {
		if (isOpen && focusedIndex >= 0) {
			optionRefs.current[focusedIndex]?.focus();
		}
	}, [isOpen, focusedIndex]);

	function openDropdown() {
		setIsOpen(true);
		const selectedIndex = LANG_OPTIONS.findIndex((o) => o.value === lang);
		setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
	}

	function handleSelect(value: LanguagePreference) {
		if (value === lang) {
			close();
			return;
		}
		document.cookie = `lang=${value}; path=/; max-age=31536000`;
		onLangChange(value);
		close();
	}

	function handleTriggerKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			if (!isOpen) {
				openDropdown();
			}
		}
	}

	function handleListboxKeyDown(e: React.KeyboardEvent) {
		switch (e.key) {
			case "ArrowDown":
				e.preventDefault();
				setFocusedIndex((prev) => (prev + 1) % LANG_OPTIONS.length);
				break;
			case "ArrowUp":
				e.preventDefault();
				setFocusedIndex(
					(prev) => (prev - 1 + LANG_OPTIONS.length) % LANG_OPTIONS.length
				);
				break;
			case "Enter":
			case " ":
				e.preventDefault();
				if (focusedIndex >= 0) {
					handleSelect(LANG_OPTIONS[focusedIndex].value);
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

	const ariaLabel = lang === "vi" ? "Chọn ngôn ngữ" : "Select language";

	return (
		<div className="relative">
			<button
				ref={triggerRef}
				id={triggerId}
				type="button"
				aria-haspopup="listbox"
				aria-expanded={isOpen}
				aria-label={ariaLabel}
				onClick={() => setIsOpen((prev) => !prev)}
				onKeyDown={handleTriggerKeyDown}
				className="flex items-center justify-between p-4 rounded-sm hover:bg-[rgba(255,255,255,0.08)] active:bg-[rgba(255,255,255,0.12)] focus:outline-2 focus:outline-[#15D5CA] focus:outline-offset-2 transition-colors duration-150 ease-in-out"
			>
				<Icon name={currentOption.flag} size={24} />
				<span className="font-montserrat text-base font-bold text-white tracking-[0.15px] mx-1">
					{currentOption.label}
				</span>
				<Icon name="chevron-down" size={16} />
			</button>

			{isOpen && (
				<>
					{/* Backdrop */}
					<div
						className="fixed inset-0 z-[99]"
						aria-hidden="true"
						onClick={close}
					/>

					{/* Dropdown */}
					<ul
						role="listbox"
						aria-labelledby={triggerId}
						onKeyDown={handleListboxKeyDown}
						className="absolute top-full right-0 mt-1 flex flex-col p-1.5 bg-[#00070C] border border-[#998C5F] rounded-lg z-[100] transition-[opacity,transform] duration-150 ease-out origin-top"
					>
						{LANG_OPTIONS.map((option, index) => (
							<li
								key={option.value}
								ref={(el) => {
									optionRefs.current[index] = el;
								}}
								role="option"
								aria-selected={lang === option.value}
								tabIndex={focusedIndex === index ? 0 : -1}
								onClick={() => handleSelect(option.value)}
								className={[
									"w-[110px] h-14 cursor-pointer",
									"flex items-center gap-1 p-4 rounded",
									"font-montserrat text-base font-bold text-white tracking-[0.15px]",
									"hover:bg-[rgba(255,234,158,0.1)]",
									"transition-colors duration-150 ease-in-out",
									"outline-none focus-visible:outline-2 focus-visible:outline-[#998C5F] focus-visible:-outline-offset-2",
									lang === option.value
										? "bg-[rgba(255,234,158,0.2)] rounded-sm"
										: "",
								]
									.filter(Boolean)
									.join(" ")}
							>
								<Icon name={option.flag} size={24} />
								<span>{option.label}</span>
							</li>
						))}
					</ul>
				</>
			)}
		</div>
	);
}
