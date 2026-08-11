import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zsnxkasagwmjftoqbkvj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzbnhrYXNhZ3dtamZ0b3Fia3ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0NTYxMzIsImV4cCI6MjEwMjAzMjEzMn0.JFQYh59r3wP7XhyWY_p2zOX3cDo0ylc5M82Xr9UKg8k'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)