"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSelector } from "@/components/login/language-selector";
import { Icon } from "@/components/ui/icon";
import { homepageDictionary } from "@/i18n/homepage";
import type { LanguagePreference } from "@/types/login";

interface HeaderProps {
	lang?: LanguagePreference;
	onLangChange?: (lang: LanguagePreference) => void;
	/** Override active nav detection. When set, matched against NAV_HREFS instead of pathname. */
	activePage?: string;
}

const NAV_HREFS = ["/", "/awards", "/kudo/live"];

export function Header({ lang = "vi", onLangChange, activePage }: HeaderProps) {
	const pathname = usePathname();
	const activeHref = activePage
		? NAV_HREFS.find((h) => h.includes(activePage)) ?? pathname
		: pathname;
	const handleLangChange = onLangChange ?? (() => {});
	const [notificationCount, setNotificationCount] = useState(0);
	const t = homepageDictionary[lang].nav;

	const navLinks = [
		{ label: t.aboutSaa, href: NAV_HREFS[0] },
		{ label: t.awardsInfo, href: NAV_HREFS[1] },
		{ label: t.sunKudos, href: NAV_HREFS[2] },
	];

	useEffect(() => {
		fetch("/api/notifications")
			.then((res) => res.json() as Promise<{ count: number }>)
			.then((data) => setNotificationCount(data.count))
			.catch(() => {
				// silent fail — notification count stays 0
			});
	}, []);

	return (
		<header
			className={[
				"fixed top-0 z-40 w-full h-20",
				"flex items-center justify-between",
				"px-[144px]",
				"bg-[rgba(11,15,18,0.8)] backdrop-blur-sm",
				"border-b border-[#2E3940]",
			].join(" ")}
		>
			{/* Left group: Logo + Nav (gap 64px per Figma node I2167:9091;186:2166) */}
			<div className="flex items-center gap-[64px]">
				{/* Logo */}
				<Link href="/" aria-label="SAA 2025 Homepage">
					<Image
						src="/images/homepage/logo-header.png"
						alt="SAA 2025"
						width={52}
						height={56}
						priority
					/>
				</Link>

				{/* Nav links (gap 24px per Figma node I2167:9091;178:653) */}
				<nav aria-label="Main navigation" className="flex items-center gap-6">
					{navLinks.map(({ label, href }) => {
						const isActive = activeHref === href;
						return (
							<Link
								key={href}
								href={href}
								className={[
									"text-[14px] font-bold leading-5 tracking-[0.1px]",
									"p-4 whitespace-nowrap",
									"transition-[color,background-color] duration-150 ease-in-out",
									"focus:outline-2 focus:outline-[#15D5CA] focus:outline-offset-2",
									isActive
										? "text-[#FFEA9E] border-b border-[#FFEA9E] [text-shadow:0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]"
										: "text-white hover:text-[#FFEA9E] rounded-[4px]",
								].join(" ")}
							>
								{label}
							</Link>
						);
					})}
				</nav>
			</div>

			{/* Right: Controls */}
			<div className="flex items-center gap-4">
				{/* Notification button */}
				<button
					type="button"
					aria-label={t.notifications}
					className={[
						"relative w-10 h-10 flex items-center justify-center",
						"rounded-sm",
						"transition-[background-color] duration-150 ease-in-out",
						"hover:bg-[rgba(255,255,255,0.08)]",
						"focus:outline-2 focus:outline-[#15D5CA] focus:outline-offset-2",
					].join(" ")}
				>
					<Icon name="notification-bell" size={24} className="[&_path]:fill-white" />
					{notificationCount > 0 && (
						<span
							data-testid="notification-badge"
							className="absolute top-1 right-1 w-2 h-2 bg-[#D4271D] rounded-full"
							aria-label={`${notificationCount} ${t.notifications}`}
						/>
					)}
				</button>

				{/* Language selector */}
				<LanguageSelector lang={lang} onLangChange={handleLangChange} />

				{/* Avatar button */}
				<button
					type="button"
					aria-label={t.account}
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
			</div>
		</header>
	);
}
