import { createServerClient } from "@supabase/ssr";
import { Database } from "@/types/database";

export const createClient = () => {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // intentionally not implement cookie access, as we
      // don't need it now and we want to use the client
      // during static rendering (cookie access isn't allowed
      // during static rendering)
      cookies: {
        getAll() {
          return [];
        },
        setAll(cookiesToSet) {},
      },
    }
  );
};
