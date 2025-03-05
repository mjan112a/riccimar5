import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          // Handle cookieStore as a Promise
          const cookieList = await cookieStore
          return cookieList.getAll()
        },
        async setAll(cookiesToSet) {
          try {
            const cookieList = await cookieStore
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieList.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        }
      }
    }
  )
}
