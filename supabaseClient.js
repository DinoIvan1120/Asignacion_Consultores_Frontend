import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ghxcqgsbawdwgbxflqku.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoeGNxZ3NiYXdkd2dieGZscWt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNTc2NzQsImV4cCI6MjA3ODYzMzY3NH0.hajkElnGXTXqY-swDwRJcow_7qTATQz2MQoD4RqbYPQ";
export const supabase = createClient(supabaseUrl, supabaseKey);
