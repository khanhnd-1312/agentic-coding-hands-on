export interface PrelaunchCountdownProps {
	eventStartTime: string; // ISO 8601
	serverTime: string; // ISO 8601
}

export type { TimeLeft } from "@/hooks/use-countdown";
