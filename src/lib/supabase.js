import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rxbhadpyytdzktwwomxb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4YmhhZHB5eXRkemt0d3dvbXhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNjQ5MDcsImV4cCI6MjA4Mzc0MDkwN30.XCaA1UZpkLe9MkdkhHXgythjplbrU11HLrzfZEAbVGU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
