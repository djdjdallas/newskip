import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Export as default for your current import in MainNav.jsx
export default function createClient() {
  return createClientComponentClient();
}

// Also export the original function for flexibility
export { createClientComponentClient };
