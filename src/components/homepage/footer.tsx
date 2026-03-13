import Image from "next/image";
import Link from "next/link";
import { homepageDictionary } from "@/i18n/homepage";
import type { LanguagePreference } from "@/types/login";

interface FooterProps {
	lang?: LanguagePreference;
}

const NAV_HREFS = ["/", "/awards", "/kudo/live", "/tieu-chuan-chung"];

export function Footer({ lang = "vi" }: FooterProps) {
	const t = homepageDictionary[lang].footer;
	const navLinks = [
		{ label: t.aboutSaa, href: NAV_HREFS[0] },
		{ label: t.awardsInfo, href: NAV_HREFS[1] },
		{ label: t.sunKudos, href: NAV_HREFS[2] },
		{ label: t.standards, href: NAV_HREFS[3] },
	];

	return (
		<footer
			className={[
				"w-full",
				"flex flex-row items-center justify-between flex-wrap gap-6",
				"py-10 px-[90px]",
				"border-t border-[#2E3940]",
			].join(" ")}
		>
			{/* Logo */}
			<Link href="/" aria-label="SAA 2025 Homepage">
				<Image
					src="/images/homepage/logo-footer.png"
					alt="SAA 2025"
					width={69}
					height={64}
				/>
			</Link>

			{/* Nav links */}
			<nav
				aria-label="Footer navigation"
				className="flex flex-row items-center gap-12 flex-wrap"
			>
				{navLinks.map(({ label, href }) => (
					<Link
						key={href}
						href={href}
						className={[
							"p-4",
						"text-white text-base font-bold leading-6 tracking-[0.15px]",
							"transition-[color] duration-150 ease-in-out",
							"hover:text-[#FFEA9E]",
							"focus:outline-2 focus:outline-[#15D5CA] focus:outline-offset-2",
						].join(" ")}
					>
						{label}
					</Link>
				))}
			</nav>

			{/* Copyright */}
			<span
				className={[
					"font-[var(--font-montserrat-alt)]",
					"text-white text-base font-bold leading-6",
				].join(" ")}
			>
				{t.copyright}
			</span>
		</footer>
	);
}
