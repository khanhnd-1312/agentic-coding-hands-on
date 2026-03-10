import { NextResponse } from "next/server";
import { z } from "zod";
import { AwardCategorySchema } from "@/types/homepage";
import { AWARDS_SEED } from "@/data/awards";

export async function GET() {
	// Zod-validate the seed data before returning (fail-fast on data integrity issues)
	const parsed = z.array(AwardCategorySchema).parse(AWARDS_SEED);
	return NextResponse.json(parsed);
}
