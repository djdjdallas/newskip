const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseUrl = "https://fflbuhhkupsrrrvdczwf.supabase.co";
const supabase = createClient(supabaseUrl, supabaseKey);
export const createClient = () => {
  return createClientComponentClient();
};
