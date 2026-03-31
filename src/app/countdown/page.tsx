import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { CountdownPrelaunchPage } from "@/components/countdown-prelaunch/countdown-prelaunch-page";
import { EVENT_DATETIME } from "@/hooks/use-countdown";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Countdown | Sun Annual Awards 2025",
	description:
		"Đếm ngược đến lễ trao giải Sun* Annual Awards 2025",
};

export default function CountdownPage() {
	const eventDate = new Date(EVENT_DATETIME);

	if (eventDate.getTime() <= Date.now()) {
		redirect("/login");
	}

	return (
		<CountdownPrelaunchPage
			eventStartTime={EVENT_DATETIME}
			serverTime={new Date().toISOString()}
		/>
	);
}
