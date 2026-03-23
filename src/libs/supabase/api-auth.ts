import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";
import { createAdminClient } from "@/libs/supabase/admin";
import type { SupabaseClient } from "@supabase/supabase-js";

/** First seed user — used as fallback sender in development when no auth */
const DEV_FALLBACK_USER_ID = "a0000001-0000-0000-0000-000000000001";

interface AuthResult {
  supabase: SupabaseClient;
  userId: string;
}

/**
 * Get Supabase client and authenticated user for API routes.
 * In development without auth, falls back to a seed user and admin client
 * so that write operations bypass RLS.
 * In production, returns 401 if no authenticated user.
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

  // Development fallback: use admin client (bypasses RLS) + seed user
  if (process.env.NODE_ENV === "development") {
    const adminClient = createAdminClient();
    if (adminClient) {
      return { supabase: adminClient, userId: DEV_FALLBACK_USER_ID };
    }
    // No admin client available — still allow with anon client
    return { supabase, userId: DEV_FALLBACK_USER_ID };
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
