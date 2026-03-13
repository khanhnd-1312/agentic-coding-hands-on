import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { CountdownPrelaunchPage } from "@/components/countdown-prelaunch/countdown-prelaunch-page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Countdown | Sun Annual Awards 2025",
	description:
		"Đếm ngược đến lễ trao giải Sun* Annual Awards 2025",
};

export default function CountdownPage() {
	const eventTime = process.env.NEXT_PUBLIC_EVENT_DATETIME;

	if (!eventTime) {
		console.warn(
			"[countdown] NEXT_PUBLIC_EVENT_DATETIME is not set — redirecting to /login",
		);
		redirect("/login");
	}

	const eventDate = new Date(eventTime);
	if (Number.isNaN(eventDate.getTime())) {
		console.warn(
			`[countdown] NEXT_PUBLIC_EVENT_DATETIME is invalid: "${eventTime}" — redirecting to /login`,
		);
		redirect("/login");
	}

	if (eventDate.getTime() <= Date.now()) {
		redirect("/login");
	}

	return (
		<CountdownPrelaunchPage
			eventStartTime={eventTime}
			serverTime={new Date().toISOString()}
		/>
	);
}
