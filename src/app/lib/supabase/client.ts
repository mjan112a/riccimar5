import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// Function to test Supabase connection
export async function testSupabaseConnection(client: SupabaseClient) {
  try {
    console.log('Testing Supabase connection...');
    const start = Date.now();
    const { data, error } = await client.from('salesdata').select('*').limit(1);
    const end = Date.now();
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return { 
        success: false, 
        error: error.message, 
        details: error,
        latency: null,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL
      };
    }
    
    console.log('Supabase connection successful!', { latency: end - start, data });
    return { 
      success: true, 
      error: null, 
      latency: end - start,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL
    };
  } catch (err: any) {
    console.error('Supabase connection test exception:', err);
    return { 
      success: false, 
      error: err.message || 'Unknown error', 
      details: err,
      latency: null,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL
    };
  }
}

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  // Log connection details for debugging
  console.log(`Attempting to connect to Supabase at URL: ${supabaseUrl}`);
  
  try {
    // Validate URL format
    try {
      new URL(supabaseUrl);
    } catch (error: any) {
      console.error('Invalid Supabase URL format:', error);
      throw new Error(`Invalid Supabase URL format: ${error.message || 'Unknown URL error'}`);
    }
    
    // Create the client
    const client = createBrowserClient(supabaseUrl, supabaseKey);
    return client;
  } catch (err: any) {
    console.error('Error creating Supabase client:', err);
    
    // Create a fallback client that logs errors
    // This allows the app to continue running with fallback data
    // instead of crashing completely
    const dummyClient: any = {
      from: () => {
        console.error('Using fallback Supabase client due to initialization error:', err.message);
        return {
          select: () => Promise.resolve({ data: null, error: new Error(`Supabase client failed to initialize: ${err.message}`) }),
          insert: () => Promise.resolve({ data: null, error: new Error(`Supabase client failed to initialize: ${err.message}`) }),
          update: () => Promise.resolve({ data: null, error: new Error(`Supabase client failed to initialize: ${err.message}`) }),
          delete: () => Promise.resolve({ data: null, error: new Error(`Supabase client failed to initialize: ${err.message}`) }),
        };
      },
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: new Error(`Supabase client failed to initialize: ${err.message}`) }),
        signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: new Error(`Supabase client failed to initialize: ${err.message}`) }),
        signOut: () => Promise.resolve({ error: new Error(`Supabase client failed to initialize: ${err.message}`) }),
      }
    };
    return dummyClient;
  }
};
