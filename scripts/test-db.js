const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Connecting to Supabase at:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: topics, error: topicsError } = await supabase.from('topics').select('*').limit(1);
  if (topicsError) {
    console.error('Error fetching topics:', topicsError);
  } else {
    console.log('Topics sample row:');
    console.log(JSON.stringify(topics, null, 2));
  }

  const { data: questions, error: questionsError } = await supabase.from('questions').select('*').limit(1);
  if (questionsError) {
    console.error('Error fetching questions:', questionsError);
  } else {
    console.log('Questions sample row:');
    console.log(JSON.stringify(questions, null, 2));
  }
}

test();
