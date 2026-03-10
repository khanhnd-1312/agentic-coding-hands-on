import { cookies } from "next/headers";
import { HomePage } from "@/components/homepage/homepage";
import { AWARDS_SEED } from "@/data/awards";
import type { LanguagePreference } from "@/types/login";

export default async function Home() {
	const store = await cookies();
	const lang = (store.get("lang")?.value ?? "vi") as LanguagePreference;

	// Read awards data directly — avoids a self-referential HTTP fetch in RSC
	const awards = AWARDS_SEED;

	return <HomePage awards={awards} lang={lang} />;
}
