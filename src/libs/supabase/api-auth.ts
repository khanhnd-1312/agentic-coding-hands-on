import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

interface AuthResult {
  supabase: SupabaseClient;
  userId: string | null;
}

/**
 * Get Supabase client and optional user for API routes.
 * In development, returns a null userId without blocking the request.
 * In production, returns 401 if no authenticated user.
 */
export async function getApiAuth(): Promise<
  AuthResult | NextResponse
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return { supabase, userId: user?.id ?? null };
}
