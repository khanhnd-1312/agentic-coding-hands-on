import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
	{ label: "About SAA 2025", href: "/" },
	{ label: "Awards Information", href: "/awards-information" },
	{ label: "Sun* Kudos", href: "/kudo/live" },
	{ label: "Tiêu chuẩn chung", href: "/tieu-chuan-chung" },
];

export function Footer() {
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
				{NAV_LINKS.map(({ label, href }) => (
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
				Bản quyền thuộc về Sun* © 2025
			</span>
		</footer>
	);
}
