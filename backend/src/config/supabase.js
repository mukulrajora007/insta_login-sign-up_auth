const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

// Check if credentials are placeholders or actually configured
const isConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseKey.includes('your-supabase-anon-key')
);

let supabase = null;

if (isConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    console.log('✅ Supabase client initialized with URL:', supabaseUrl);
  } catch (error) {
    console.error('❌ Failed to initialize Supabase client:', error.message);
  }
} else {
  console.warn('\n⚠️ [NOTICE] Supabase credentials not set in backend/.env.');
  console.warn('The backend will run in dev/fallback mode so you can preview the frontend.');
  console.warn('To connect to live Supabase, update SUPABASE_URL and SUPABASE_ANON_KEY in backend/.env\n');
}

module.exports = {
  supabase,
  isConfigured,
};
