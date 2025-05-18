import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// Note: In a production environment, these values should be stored in environment variables
const supabaseUrl = 'https://foresightpm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvcmVzaWdodHBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2MzM4ODMsImV4cCI6MjAzMTIwOTg4M30.qZK_XsZ-QpS9dZgGKA-JYXlJ2pS8fHjJw-y3G6Rjn_I';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
