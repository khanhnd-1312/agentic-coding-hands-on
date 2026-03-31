"use client";

import { useEffect, useRef, useId, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { Toast } from "@/components/kudos-live-board/toast";
import { createClient } from "@/libs/supabase/client";

interface ProfileDropdownProps {
	isOpen: boolean;
	onToggle: (open: boolean) => void;
}

export function ProfileDropdown({ isOpen, onToggle }: ProfileDropdownProps) {
	const router = useRouter();
	const pathname = usePathname();
	const triggerId = useId();
	const triggerRef = useRef<HTMLButtonElement>(null);
	const menuItemRefs = useRef<(HTMLButtonElement | null)[]>([null, null]);
	const [focusedIndex, setFocusedIndex] = useState(-1);
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const close = useCallback(() => {
		onToggle(false);
		setFocusedIndex(-1);
	}, [onToggle]);

	// Close on Escape (document-level)
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

	// Focus management
	useEffect(() => {
		if (isOpen && focusedIndex >= 0) {
			menuItemRefs.current[focusedIndex]?.focus();
		}
	}, [isOpen, focusedIndex]);

	// Reset focusedIndex when closing
	useEffect(() => {
		if (!isOpen) {
			setFocusedIndex(-1);
		}
	}, [isOpen]);

	function handleProfileClick() {
		if (pathname !== "/profile") {
			router.push("/profile");
		}
		close();
	}

	const handleLogout = useCallback(async () => {
		setIsLoggingOut(true);
		try {
			const supabase = createClient();
			const { error: signOutError } = await supabase.auth.signOut();
			if (signOutError) throw signOutError;
			router.push("/login");
		} catch {
			setError("Đăng xuất thất bại. Vui lòng thử lại.");
			setIsLoggingOut(false);
		}
	}, [router]);

	function handleTriggerKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			if (!isOpen) {
				onToggle(true);
				setFocusedIndex(0);
			}
		}
	}

	function handleMenuKeyDown(e: React.KeyboardEvent) {
		switch (e.key) {
			case "ArrowDown":
				e.preventDefault();
				setFocusedIndex((prev) => (prev + 1) % 2);
				break;
			case "ArrowUp":
				e.preventDefault();
				setFocusedIndex((prev) => (prev - 1 + 2) % 2);
				break;
			case "Enter":
			case " ":
				e.preventDefault();
				if (focusedIndex === 0) handleProfileClick();
				else if (focusedIndex === 1) handleLogout();
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
			{/* Trigger */}
			<button
				ref={triggerRef}
				id={triggerId}
				type="button"
				aria-haspopup="menu"
				aria-expanded={isOpen}
				aria-label="User menu"
				onClick={() => onToggle(!isOpen)}
				onKeyDown={handleTriggerKeyDown}
				className={[
					"w-10 h-10 rounded",
					"border border-[#998C5F]",
					"flex items-center justify-center",
					"transition-[box-shadow] duration-150 ease-in-out",
					"hover:shadow-[0_0_0_2px_#998C5F]",
					"focus:outline-2 focus:outline-[#15D5CA] focus:outline-offset-2",
				].join(" ")}
			>
				<Icon name="user-avatar" size={24} className="[&_path]:fill-white" />
			</button>

			{/* Backdrop */}
			{isOpen && (
				<div
					className="fixed inset-0 z-[99]"
					aria-hidden="true"
					onClick={close}
				/>
			)}

			{/* Dropdown panel */}
			<div
				role="menu"
				aria-labelledby={triggerId}
				onKeyDown={handleMenuKeyDown}
				className={[
					"flex flex-col p-1.5",
					"bg-[#00070C] border border-[#998C5F] rounded-lg",
					"z-[100] absolute right-0 mt-1",
					"transition-[opacity,transform] duration-150 ease-out origin-top",
					isOpen
						? "opacity-100 scale-y-100"
						: "opacity-0 scale-y-[0.95] pointer-events-none",
				].join(" ")}
			>
				{/* Profile item */}
				<button
					ref={(el) => { menuItemRefs.current[0] = el; }}
					role="menuitem"
					tabIndex={focusedIndex === 0 ? 0 : -1}
					onClick={handleProfileClick}
					className={[
						"w-[121px] h-14 rounded p-4",
						"flex items-center gap-1 cursor-pointer",
						"bg-[rgba(255,234,158,0.1)]",
						"focus:outline-2 focus:outline-[#998C5F] focus:-outline-offset-2",
					].join(" ")}
				>
					<span className="font-montserrat text-base font-bold text-white tracking-[0.15px] [text-shadow:0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]">
						Profile
					</span>
					<Icon name="user-avatar" size={24} />
				</button>

				{/* Logout item */}
				<button
					ref={(el) => { menuItemRefs.current[1] = el; }}
					role="menuitem"
					tabIndex={focusedIndex === 1 ? 0 : -1}
					disabled={isLoggingOut}
					onClick={handleLogout}
					className={[
						"w-[121px] h-14 rounded p-4",
						"flex items-center gap-1 cursor-pointer text-white",
						"bg-transparent hover:bg-[rgba(255,234,158,0.1)]",
						"focus:outline-2 focus:outline-[#998C5F] focus:-outline-offset-2",
						isLoggingOut ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
					].join(" ")}
				>
					<span className="font-montserrat text-base font-bold text-white tracking-[0.15px]">
						Logout
					</span>
					<Icon name="chevron-right" size={24} />
				</button>
			</div>

			{/* Error toast */}
			<Toast message={error} onDismiss={() => setError(null)} duration={3000} />
		</div>
	);
}
