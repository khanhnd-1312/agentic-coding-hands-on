import type { LanguagePreference } from "@/types/login";

export interface CountdownPrelaunchDictionary {
	heading: string;
	days: string;
	hours: string;
	minutes: string;
}

const vi: CountdownPrelaunchDictionary = {
	heading: "Sự kiện sẽ bắt đầu sau",
	days: "DAYS",
	hours: "HOURS",
	minutes: "MINUTES",
};

const en: CountdownPrelaunchDictionary = {
	heading: "Event starts in",
	days: "DAYS",
	hours: "HOURS",
	minutes: "MINUTES",
};

export const countdownPrelaunchDictionary: Record<
	LanguagePreference,
	CountdownPrelaunchDictionary
> = { vi, en };
