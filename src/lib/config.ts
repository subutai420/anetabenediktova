import { supabase } from "@/integrations/supabase/client";

const url: string = (supabase as unknown as { supabaseUrl?: string }).supabaseUrl ?? "";

/** True, pokud je web napojený na skutečnou databázi. Jinak běží nad statickými daty z /public/data. */
export const isSupabaseConfigured = Boolean(url) && !url.includes("placeholder");
