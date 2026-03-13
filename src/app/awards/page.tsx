import { cookies } from "next/headers";
import { z } from "zod";
import { AwardSystemPage } from "@/components/awards/award-system-page";
import { AWARDS_SEED } from "@/data/awards";
import type { Metadata } from "next";

const langSchema = z.enum(["vi", "en"]).catch("vi");

export const metadata: Metadata = {
	title: "Hệ Thống Giải | Sun Annual Awards 2025",
};

export default async function AwardsPage() {
	const store = await cookies();
	const lang = langSchema.parse(store.get("lang")?.value);

	return <AwardSystemPage awards={AWARDS_SEED} initialLang={lang} />;
}
