import { cookies } from "next/headers";
import { z } from "zod";
import { HomePage } from "@/components/homepage/homepage";
import { AWARDS_SEED } from "@/data/awards";

const langSchema = z.enum(["vi", "en"]).catch("vi");

export default async function Home() {
	const store = await cookies();
	const lang = langSchema.parse(store.get("lang")?.value);

	// Read awards data directly — avoids a self-referential HTTP fetch in RSC
	const awards = AWARDS_SEED;

	return <HomePage awards={awards} initialLang={lang} />;
}
