"use client";

import { Icon } from "@/components/ui/icon";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { awardsDictionary } from "@/i18n/awards";
import type { LanguagePreference } from "@/types/login";

interface AwardNavMenuProps {
	categories: { slug: string; name: string }[];
	lang?: LanguagePreference;
}

export function AwardNavMenu({ categories, lang = "vi" }: AwardNavMenuProps) {
	const t = awardsDictionary[lang];
	const sectionIds = categories.map((c) => c.slug);
	const activeId = useScrollSpy(sectionIds);

	return (
		<nav aria-label={t.navAriaLabel}>
			<div className="flex flex-row overflow-x-auto lg:flex-col gap-4 w-full lg:w-44.5 lg:sticky lg:top-20">
				{categories.map((category) => {
					const isActive = activeId === category.slug;
					return (
						<button
							key={category.slug}
							type="button"
							aria-current={isActive ? "true" : undefined}
							onClick={() => {
								document
									.getElementById(category.slug)
									?.scrollIntoView({ behavior: "smooth" });
							}}
							className={[
								"flex flex-row items-center gap-1 p-4 rounded text-left",
								"text-sm font-bold leading-5 tracking-[0.25px]",
								"font-(family-name:--font-montserrat)",
								"transition-[color,background-color,border-color] duration-150 ease-in-out",
								"focus:outline-2 focus:outline-[#15D5CA] focus:outline-offset-2",
								"cursor-pointer",
								isActive
									? "border-b border-[#FFEA9E] text-[#FFEA9E] [text-shadow:0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]"
									: "text-white hover:bg-[rgba(255,234,158,0.1)]",
							].join(" ")}
						>
							<Icon name="target" size={24} />
							{category.name}
						</button>
					);
				})}
			</div>
		</nav>
	);
}
