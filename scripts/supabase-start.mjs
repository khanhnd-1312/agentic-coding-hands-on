/**
 * Start the local Supabase stack with env vars loaded from .env.development.
 *
 * Supabase CLI reads environment variable substitutions in config.toml (e.g.
 * `env(GOOGLE_CLIENT_ID)`) from the PROCESS environment — not from Next.js
 * env files (.env.development).  Running `supabase start` directly therefore
 * leaves those values unset, causing Google OAuth to receive a placeholder
 * client_id and return "Access blocked: Authorization Error".
 *
 * Usage:  yarn supabase:start
 */

import { spawnSync } from "node:child_process";

const result = spawnSync("supabase", ["start"], {
  stdio: "inherit",
  env: process.env,
  shell: true,
});

process.exit(result.status ?? 0);
