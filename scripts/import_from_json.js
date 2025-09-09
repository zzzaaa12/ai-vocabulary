// Import words from data/vocabulary.json into Supabase
// Usage:
//   set SUPABASE_URL=...; set SUPABASE_SERVICE_ROLE_KEY=...; set IMPORT_TARGET_USER_ID=...; node scripts/import_from_json.js

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TARGET_USER_ID = process.env.IMPORT_TARGET_USER_ID; // Must be an existing user id

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !TARGET_USER_ID) {
  console.error('Missing env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, IMPORT_TARGET_USER_ID');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const file = path.join(process.cwd(), 'data', 'vocabulary.json');
if (!fs.existsSync(file)) {
  console.error('data/vocabulary.json not found');
  process.exit(1);
}

const raw = fs.readFileSync(file, 'utf-8');
const json = JSON.parse(raw || '{}');
const list = json.vocabulary || [];

async function run() {
  console.log(`Importing ${list.length} words...`);
  let success = 0, dup = 0, fail = 0;
  for (const w of list) {
    const payload = {
      user_id: TARGET_USER_ID,
      word: (w.word || '').trim(),
      chinese_meaning: (w.chinese_meaning || '').trim(),
      english_meaning: (w.english_meaning || null),
      phonetic: (w.phonetic || null),
      example_sentence: (w.example_sentence || null),
      synonyms: Array.isArray(w.synonyms) ? w.synonyms : null,
      antonyms: Array.isArray(w.antonyms) ? w.antonyms : null,
    };
    if (!payload.word || !payload.chinese_meaning) { fail++; continue; }
    const { error } = await supabase.from('words').insert([payload]);
    if (error) {
      if (error.code === '23505') { dup++; } else { fail++; console.error(error.message); }
    } else {
      success++;
    }
  }
  console.log({ success, dup, fail, total: list.length });
}

run().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });

