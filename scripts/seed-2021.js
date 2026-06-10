const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    env[key] = value.trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ─── GATE MT 2021 — Parsing Questions ─────────────────────────────────────────
const rawContent = fs.readFileSync(path.join(__dirname, '2021_raw_full.txt'), 'utf8');
const questionBlocks = rawContent.split('---').map(s => s.trim()).filter(s => s.startsWith('Q.'));

const questionsData = [];

for (const block of questionBlocks) {
  try {
    const lines = block.split('\n').map(l => l.trim());
    
    let subject = '';
    let topic = '';
    let q_type = '';
    let pyq_year = 2021;
    let difficulty = '';
    let marks = 1;
    let negative_marks = 0;
    
    let questionText = [];
    let optionsText = [];
    let correctAnswersText = '';
    let explanationText = [];
    
    let state = 'META'; // META, QTEXT, OPTIONS, ANSWER, EXPLANATION
    
    for (let i = 1; i < lines.length; i++) { // start from 1 to skip "Q.X (MT)"
      const line = lines[i];
      if (!line) continue;
      
      if (state === 'META') {
        if (line.startsWith('Subject:')) { subject = line.replace('Subject:', '').trim(); }
        else if (line.startsWith('Topic:')) { topic = line.replace('Topic:', '').trim(); }
        else if (line.startsWith('Type:')) { q_type = line.replace('Type:', '').trim(); }
        else if (line.startsWith('Year:')) { pyq_year = parseInt(line.replace('Year:', '').trim()); }
        else if (line.startsWith('Difficulty:')) { difficulty = line.replace('Difficulty:', '').trim(); }
        else if (line.startsWith('Marks:')) { marks = parseFloat(line.replace('Marks:', '').trim()); }
        else if (line.startsWith('Negative Marks:')) { negative_marks = parseFloat(line.replace('Negative Marks:', '').trim()); }
        else if (line.startsWith('Question Text:')) { state = 'QTEXT'; }
        else if (line.startsWith('⚠️ IMAGE REQUIRED:')) {
            // Keep image requirement in question text
            questionText.push(`> ${line}`);
        }
      } else if (state === 'QTEXT') {
        if (line.startsWith('Options:') && (q_type === 'MCQ' || q_type === 'MSQ')) {
          state = 'OPTIONS';
        } else if (line.startsWith('Correct Answer:')) {
          correctAnswersText = line.replace('Correct Answer:', '').trim();
          state = 'ANSWER';
        } else if (line.startsWith('Given:') || line.startsWith('Assume:')) {
          questionText.push(line);
        } else {
          questionText.push(line);
        }
      } else if (state === 'OPTIONS') {
        if (line.startsWith('Correct Answer:')) {
          correctAnswersText = line.replace('Correct Answer:', '').trim();
          state = 'ANSWER';
        } else {
          optionsText.push(line);
        }
      } else if (state === 'ANSWER') {
        if (line.startsWith('Explanation:')) {
          state = 'EXPLANATION';
        } else {
          // might be multiline answer somehow, but usually just one line
          correctAnswersText += ' ' + line;
        }
      } else if (state === 'EXPLANATION') {
        if (line.startsWith('Action:')) {
            explanationText.push(`*${line}*`);
        } else {
            explanationText.push(line);
        }
      }
    }
    
    // Parse options
    let parsedOptions = null;
    let parsedCorrectOptions = [];
    
    if (q_type === 'MCQ' || q_type === 'MSQ') {
      parsedOptions = [];
      let currentOptId = null;
      let currentOptText = [];
      for (const optLine of optionsText) {
        const match = optLine.match(/^([A-D])\)\s*(.*)/);
        if (match) {
          if (currentOptId) {
            parsedOptions.push({ id: currentOptId, text: currentOptText.join('\n') });
          }
          currentOptId = match[1];
          currentOptText = [match[2]];
        } else {
          if (currentOptId) currentOptText.push(optLine);
        }
      }
      if (currentOptId) {
        parsedOptions.push({ id: currentOptId, text: currentOptText.join('\n') });
      }
      
      // Parse correct answer
      // Example for MCQ: "Correct Answer: B", "Correct Answer: A" or "Correct Answer: B (P–3...)"
      const match = correctAnswersText.match(/^([A-D])/);
      if (match) {
         parsedCorrectOptions.push(match[1]);
      } else if (correctAnswersText.includes(',')) {
         // MSQ like "A, B"
         parsedCorrectOptions = correctAnswersText.split(',').map(s => s.trim().charAt(0));
      } else {
          // fallback extract all A, B, C, D
          for (const char of ['A', 'B', 'C', 'D']) {
             if (correctAnswersText.includes(char)) parsedCorrectOptions.push(char);
          }
      }
      // Only keep unique first letters just in case
      parsedCorrectOptions = [...new Set(parsedCorrectOptions.filter(x => ['A','B','C','D'].includes(x)))];
      
      if (parsedCorrectOptions.length === 0) {
          // Edge case: Correct Answer: C
          const firstChar = correctAnswersText.charAt(0);
          if (['A','B','C','D'].includes(firstChar)) {
              parsedCorrectOptions.push(firstChar);
          }
      }

    } else if (q_type === 'NAT') {
      parsedOptions = null;
      // Answer might be "25", "48", "-48251 to -48240"
      // the schema from 2023 expects correct_options to be ["val-val"] or something?
      // For NAT: correct_options: ["10.8-11.2"] or ["25-25"]
      let rangeMatch = correctAnswersText.match(/^(-?[\d\.]+)\s*to\s*(-?[\d\.]+)$/);
      if (rangeMatch) {
          parsedCorrectOptions = [`${rangeMatch[1]}-${rangeMatch[2]}`];
      } else {
          // Single value
          let valMatch = correctAnswersText.match(/^(-?[\d\.]+)/);
          if (valMatch) {
              parsedCorrectOptions = [`${valMatch[1]}-${valMatch[1]}`];
          } else {
              parsedCorrectOptions = [correctAnswersText]; // fallback
          }
      }
    }
    
    questionsData.push({
      subject,
      topic,
      q_type,
      pyq_year,
      difficulty,
      marks,
      negative_marks,
      question_text: questionText.join('\n'),
      options: parsedOptions,
      correct_options: parsedCorrectOptions,
      explanation: explanationText.join('\n')
    });
    
  } catch (err) {
    console.error(`Error parsing block: ${err.message}`);
  }
}

// ─── Main Seeding Function ────────────────────────────────────────────────────
async function seed() {
  console.log('🔍 Fetching existing subjects and topics...');
  const { data: extSubjects, error: sErr } = await supabase.from('subjects').select('id, name, slug');
  if (sErr) throw sErr;

  const subjectsMap = {};
  extSubjects.forEach(s => {
    const slugKey = s.slug || slugify(s.name);
    subjectsMap[slugKey] = s.id;
  });

  const { data: extTopics, error: tErr } = await supabase.from('topics').select('id, subject_id, name, slug');
  if (tErr) throw tErr;

  const topicsMap = {};
  extTopics.forEach(t => {
    const slugKey = t.slug || slugify(t.name);
    topicsMap[`${t.subject_id}:${slugKey}`] = t.id;
  });

  console.log(`✅ Loaded ${extSubjects.length} subjects and ${extTopics.length} topics.`);
  console.log(`📝 Processing ${questionsData.length} GATE MT 2021 questions...\n`);

  let newSubjectsCreated = 0;
  let newTopicsCreated = 0;
  let questionsInserted = 0;
  let questionsUpdated = 0;

  for (const q of questionsData) {
    const subName = q.subject;
    const subSlug = slugify(subName);

    // 1. Ensure subject exists
    let subId = subjectsMap[subSlug];
    if (!subId) {
      console.log(`  ➕ Creating subject: "${subName}"...`);
      const { data: newSub, error: subCreateErr } = await supabase
        .from('subjects')
        .insert({ name: subName, slug: subSlug })
        .select('id')
        .single();

      if (subCreateErr) {
        console.error(`  ❌ Failed to create subject "${subName}":`, subCreateErr.message);
        continue;
      }
      subId = newSub.id;
      subjectsMap[subSlug] = subId;
      newSubjectsCreated++;
    }

    // 2. Ensure topic exists
    const topName = q.topic;
    const topSlug = slugify(topName);
    const topicKey = `${subId}:${topSlug}`;
    let topId = topicsMap[topicKey];

    if (!topId) {
      console.log(`  ➕ Creating topic: "${topName}" under "${subName}"...`);
      const { data: newTop, error: topCreateErr } = await supabase
        .from('topics')
        .insert({ subject_id: subId, name: topName, slug: topSlug })
        .select('id')
        .single();

      if (topCreateErr) {
        console.error(`  ❌ Failed to create topic "${topName}":`, topCreateErr.message);
        continue;
      }
      topId = newTop.id;
      topicsMap[topicKey] = topId;
      newTopicsCreated++;
    }

    // 3. Check for duplicates / existing questions
    const { data: dupCheck, error: dupErr } = await supabase
      .from('questions')
      .select('id')
      .eq('question_text', q.question_text.trim())
      .eq('pyq_year', q.pyq_year)
      .limit(1);

    if (dupErr) {
      console.error('  ⚠️  Error checking duplicate:', dupErr.message);
      continue;
    }

    const payload = {
      subject_id: subId,
      topic_id: topId,
      q_type: q.q_type,
      pyq_year: q.pyq_year,
      is_pyq: true,
      difficulty: q.difficulty,
      marks: q.marks,
      negative_marks: q.negative_marks,
      question_text: q.question_text.trim(),
      options: q.options,
      correct_options: q.correct_options,
      explanation: q.explanation.trim(),
      is_premium: false
    };

    if (dupCheck && dupCheck.length > 0) {
      // Update existing question
      const existingId = dupCheck[0].id;
      const { error: updErr } = await supabase
        .from('questions')
        .update(payload)
        .eq('id', existingId);

      if (updErr) {
        console.error(`  ❌ Error updating: "${q.question_text.substring(0, 50)}..."`, updErr.message);
      } else {
        questionsUpdated++;
        console.log(`  🔄 Updated [${q.q_type}][${q.difficulty}] ${q.subject} — ${q.topic} (${q.pyq_year})`);
      }
    } else {
      // Insert new question
      const { error: insErr } = await supabase.from('questions').insert(payload);
      if (insErr) {
        console.error(`  ❌ Error inserting: "${q.question_text.substring(0, 50)}..."`, insErr.message);
      } else {
        questionsInserted++;
        console.log(`  ✅ Inserted [${q.q_type}][${q.difficulty}] ${q.subject} — ${q.topic} (${q.pyq_year})`);
      }
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  GATE MT 2021 Seeding Complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`  New subjects created  : ${newSubjectsCreated}`);
  console.log(`  New topics created    : ${newTopicsCreated}`);
  console.log(`  Questions inserted    : ${questionsInserted}`);
  console.log(`  Questions updated    : ${questionsUpdated}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

seed().catch(err => {
  console.error('❌ Seeding script failed:', err);
  process.exit(1);
});
