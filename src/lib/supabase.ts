import { createClient } from '@supabase/supabase-js'

/** Service-role client for server-side API routes only — never expose to the browser */
export function createServiceClient() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
