const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseUrl = "https://fflbuhhkupsrrrvdczwf.supabase.co";
NEXT_PUBLIC_SUPABASE_ANON_KEY =
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
    .eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmbGJ1aGhrdXBzcnJydmRjendmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MDIzNTksImV4cCI6MjA1OTA3ODM1OX0
    .ml9dj_WjZHtZaKk3OAiK - IfH4LpvJqwtgp2DLRPnfPU;

const supabase = createClient(supabaseUrl, supabaseKey);
export const createClient = () => {
  return createClientComponentClient();
};
