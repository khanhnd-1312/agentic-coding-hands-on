import type { Metadata } from "next";
import {
	Geist,
	Geist_Mono,
	Montserrat,
	Montserrat_Alternates,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const montserrat = Montserrat({
	variable: "--font-montserrat",
	weight: ["400", "700"],
	subsets: ["latin", "vietnamese"],
});

const montserratAlternates = Montserrat_Alternates({
	variable: "--font-montserrat-alt",
	weight: ["700"],
	subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
	title: "Sun Annual Awards 2025",
	description: "Sun* Annual Awards 2025 — Celebrating outstanding contributions",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="vi">
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${montserratAlternates.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
