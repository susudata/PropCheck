/**
 * Supabase Configuration
 * PropCheck - Phase 2: Authentication
 */

const SUPABASE_URL = 'https://dckbtothmifvykdsudbt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRja2J0b3RobWlmdnlrZHN1ZGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MjY2NjUsImV4cCI6MjA5NDEwMjY2NX0.Qtb3JCBjSeFaFajbgTgiUVzl7XUKvRw4pAYnj6ixT8s';

// Initialize Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other files
window.supabaseClient = supabaseClient;
