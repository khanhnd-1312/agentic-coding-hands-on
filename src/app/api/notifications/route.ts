import { NextResponse } from "next/server";
import { NotificationCountSchema } from "@/types/homepage";

export async function GET() {
	// Stub: returns 0 until real notification data is available
	const data = NotificationCountSchema.parse({ count: 0 });
	return NextResponse.json(data);
}
