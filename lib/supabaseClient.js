import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://btqckhbjonggdwtghqhc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0cWNraGJqb25nZ2R3dGdocWhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc0NzA2MDIsImV4cCI6MjAwMzA0NjYwMn0.n45dmV885FZ2b5-TTQmb6LPnG9AtceSkA8kkygU1jUU";


export const supabase = createClient(supabaseUrl, supabaseKey);

