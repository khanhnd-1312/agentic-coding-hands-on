import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

interface AuthResult {
  supabase: SupabaseClient;
  userId: string;
}

/**
 * Get Supabase client and authenticated user for API routes.
 * Returns 401 if no authenticated user.
 */
export async function getApiAuth(): Promise<
  AuthResult | NextResponse
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return { supabase, userId: user.id };
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
