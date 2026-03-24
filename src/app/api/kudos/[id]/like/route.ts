import { NextRequest, NextResponse } from "next/server";
import { getApiAuth } from "@/libs/supabase/api-auth";
import { KudosIdParamSchema } from "@/types/kudos";

interface RouteContext {
	params: Promise<{ id: string }>;
}

export async function POST(_request: NextRequest, context: RouteContext) {
	const rawParams = await context.params;
	const parsed = KudosIdParamSchema.safeParse(rawParams);

	if (!parsed.success) {
		return NextResponse.json(
			{ error: "Invalid kudos ID", details: parsed.error.flatten() },
			{ status: 400 },
		);
	}

	const { id: kudosId } = parsed.data;
	const auth = await getApiAuth();
	if (auth instanceof NextResponse) return auth;
	const { supabase, userId } = auth;

	// Fetch the kudos to verify it exists and check sender
	const { data: kudos, error: kudosError } = await supabase
		.from("kudos")
		.select("id, sender_id")
		.eq("id", kudosId)
		.single();

	if (kudosError || !kudos) {
		return NextResponse.json({ error: "Kudos not found" }, { status: 404 });
	}

	// BR-002: Sender cannot like own kudos
	if (kudos.sender_id === (userId ?? "")) {
		return NextResponse.json(
			{ error: "Cannot like your own kudos" },
			{ status: 403 },
		);
	}

	// Check if today is a special day
	const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
	const { data: specialDay } = await supabase
		.from("special_days")
		.select("multiplier")
		.eq("date", today)
		.single();

	const isSpecialDay = !!specialDay;
	const timPoints = isSpecialDay ? (specialDay.multiplier ?? 2) : 1;

	// Insert heart record (unique constraint will prevent duplicates)
	const { error: heartError } = await supabase.from("kudos_hearts").insert({
		user_id: userId ?? "",
		kudos_id: kudosId,
		is_special_day: isSpecialDay,
	});

	if (heartError) {
		// Unique constraint violation — already liked
		if (heartError.code === "23505") {
			return NextResponse.json(
				{ error: "Already liked this kudos" },
				{ status: 409 },
			);
		}
		return NextResponse.json(
			{ error: "Failed to create heart", details: heartError.message },
			{ status: 500 },
		);
	}

	// Increment kudos heart_count
	await supabase.rpc("increment_heart_count", { kudos_row_id: kudosId });

	// Award tim points to kudos sender
	await supabase.rpc("award_tim_points", {
		target_user_id: kudos.sender_id,
		points: timPoints,
	});

	// Re-fetch updated heart_count after increment
	const { data: updatedKudos } = await supabase
		.from("kudos")
		.select("heart_count")
		.eq("id", kudosId)
		.single();

	return NextResponse.json(
		{
			kudo_id: kudosId,
			heart_count: updatedKudos?.heart_count ?? 0,
			tim_awarded: timPoints,
		},
		{ status: 201 },
	);
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
	const rawParams = await context.params;
	const parsed = KudosIdParamSchema.safeParse(rawParams);

	if (!parsed.success) {
		return NextResponse.json(
			{ error: "Invalid kudos ID", details: parsed.error.flatten() },
			{ status: 400 },
		);
	}

	const { id: kudosId } = parsed.data;
	const auth = await getApiAuth();
	if (auth instanceof NextResponse) return auth;
	const { supabase, userId } = auth;

	// Fetch the heart record to get is_special_day flag for accurate tim revocation
	const { data: heart, error: heartFetchError } = await supabase
		.from("kudos_hearts")
		.select("id, is_special_day, kudos_id")
		.eq("user_id", userId ?? "")
		.eq("kudos_id", kudosId)
		.single();

	if (heartFetchError || !heart) {
		return NextResponse.json(
			{ error: "Heart not found — you have not liked this kudos" },
			{ status: 404 },
		);
	}

	// Fetch kudos sender and current heart_count for response
	const { data: kudos } = await supabase
		.from("kudos")
		.select("sender_id, heart_count")
		.eq("id", kudosId)
		.single();

	if (!kudos) {
		return NextResponse.json({ error: "Kudos not found" }, { status: 404 });
	}

	// Calculate tim to revoke based on is_special_day flag stored on the heart
	const timToRevoke = heart.is_special_day ? 2 : 1;

	// Delete the heart record
	const { error: deleteError } = await supabase
		.from("kudos_hearts")
		.delete()
		.eq("id", heart.id);

	if (deleteError) {
		return NextResponse.json(
			{ error: "Failed to remove heart", details: deleteError.message },
			{ status: 500 },
		);
	}

	// Decrement kudos heart_count
	await supabase.rpc("decrement_heart_count", { kudos_row_id: kudosId });

	// Revoke tim points from kudos sender
	await supabase.rpc("revoke_tim_points", {
		target_user_id: kudos.sender_id,
		points: timToRevoke,
	});

	return NextResponse.json({
		kudo_id: kudosId,
		heart_count: (kudos.heart_count ?? 1) - 1,
		tim_revoked: timToRevoke,
	});
}
