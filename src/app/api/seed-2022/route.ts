import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const logs: string[] = [];
  try {
    const rawTextPath = path.join(process.cwd(), 'scripts', '2022_raw.txt');
    const rawText = fs.readFileSync(rawTextPath, 'utf8');

    // Parse the raw text
    const blocks = rawText.split('---').map(b => b.trim()).filter(b => b.startsWith('Q.'));
    const questionsData = [];

    for (const block of blocks) {
      const qNumMatch = block.match(/^Q\.(\d+)/);
      if (!qNumMatch) continue;
      const qNum = parseInt(qNumMatch[1], 10);

      let isImageOnly = block.includes('⚠️ IMAGE REQUIRED:');
      
      const subjectMatch = block.match(/Subject:\s*(.*)/);
      const topicMatch = block.match(/Topic:\s*(.*)/);
      const typeMatch = block.match(/Type:\s*(MCQ|MSQ|NAT)/);
      const yearMatch = block.match(/Year:\s*(\d+)/);
      const difficultyMatch = block.match(/Difficulty:\s*(Easy|Medium|Hard)/);
      const marksMatch = block.match(/Marks:\s*([\d.]+)/);
      const negMarksMatch = block.match(/Negative Marks:\s*([\d.]+)/);
      
      let subject = subjectMatch ? subjectMatch[1].trim() : 'General Aptitude';
      let topic = topicMatch ? topicMatch[1].trim() : 'General Aptitude';
      let qType = typeMatch ? typeMatch[1].trim() : 'MCQ';
      let year = yearMatch ? parseInt(yearMatch[1], 10) : 2022;
      let difficulty = difficultyMatch ? difficultyMatch[1].trim() : 'Medium';
      let marks = marksMatch ? parseFloat(marksMatch[1]) : 1;
      let negMarks = negMarksMatch ? parseFloat(negMarksMatch[1]) : 0;

      let questionText = "";
      let options = [];
      let correctOptions = [];
      let correctAnswerRange = null;
      let explanation = "";

      if (isImageOnly) {
        questionText = `[IMAGE: 2022_Q${qNum}.png]\n\n` + (block.match(/⚠️ IMAGE REQUIRED:\s*(.*?)(?=\nCorrect Answer:)/s)?.[1]?.trim() || '');
        const cMatch = block.match(/Correct Answers?:\s*(.*)/);
        if (cMatch) {
            let cAns = cMatch[1];
            if (qType === 'NAT' || cAns.match(/([-\d.]+)\s*to\s*([-\d.]+)/)) {
                qType = 'NAT'; // Just to be sure
                let rMatch = cAns.match(/([-\d.]+)\s*to\s*([-\d.]+)/);
                if (rMatch) correctAnswerRange = [parseFloat(rMatch[1]), parseFloat(rMatch[2])];
                else correctAnswerRange = [parseFloat(cAns), parseFloat(cAns)];
            } else {
                let letters = cAns.match(/[A-D]/g) || [];
                correctOptions = letters;
            }
        }
        const expMatch = block.match(/Explanation:\s*(.*)/s);
        if (expMatch) explanation = expMatch[1].replace(/Action:.*$/, '').trim();
      } else {
        const qtMatch = block.match(/Question Text:\s*(.*?)(?=\nOptions:|\nCorrect Answer:)/s);
        if (qtMatch) questionText = qtMatch[1].trim();

        if (qType === 'MCQ' || qType === 'MSQ') {
           const optBlockMatch = block.match(/Options:\s*(.*?)(?=\nCorrect Answer:)/s);
           if (optBlockMatch) {
             const oLines = optBlockMatch[1].split('\n').map(l => l.trim()).filter(l => l);
             for (let l of oLines) {
                let oMatch = l.match(/^([A-D])\)\s*(.*)/);
                if (oMatch) {
                    options.push({ id: oMatch[1], text: oMatch[2].trim() });
                }
             }
           }
           const cMatch = block.match(/Correct Answers?:\s*(.*)/);
           if (cMatch) {
             let letters = cMatch[1].match(/[A-D]/g) || [];
             correctOptions = letters;
           }
        } else if (qType === 'NAT') {
           const cMatch = block.match(/Correct Answer:\s*(.*)/);
           if (cMatch) {
             let cAns = cMatch[1];
             let rMatch = cAns.match(/([-\d.]+)\s*to\s*([-\d.]+)/);
             if (rMatch) {
                 correctAnswerRange = [parseFloat(rMatch[1]), parseFloat(rMatch[2])];
             } else {
                 let val = parseFloat(cAns.replace(/[^\d.-]/g, ''));
                 correctAnswerRange = [val, val];
             }
           }
        }

        const expMatch = block.match(/Explanation:\s*(.*)/s);
        if (expMatch) explanation = expMatch[1].trim();
      }

      questionsData.push({
        subject, topic, q_type: qType, pyq_year: year, difficulty, marks, negative_marks: negMarks,
        question_text: questionText, options: options.length > 0 ? options : null, correct_options: correctOptions.length > 0 ? correctOptions : null,
        correct_answer_range: correctAnswerRange, explanation
      });
    }

    logs.push(`Parsed ${questionsData.length} questions from text.`);

    // Seed database
    const { data: extSubjects, error: sErr } = await supabase.from('subjects').select('id, name, slug');
    if (sErr) throw sErr;
    
    const subjectsMap: Record<string, string> = {};
    extSubjects.forEach((s: any) => {
      const slugKey = s.slug || slugify(s.name);
      subjectsMap[slugKey] = s.id;
    });

    const { data: extTopics, error: tErr } = await supabase.from('topics').select('id, name, subject_id, slug');
    if (tErr) throw tErr;
    
    const topicsMap: Record<string, string> = {};
    extTopics.forEach((t: any) => {
      const slugKey = t.slug || slugify(t.name);
      topicsMap[`${t.subject_id}:${slugKey}`] = t.id;
    });

    const { data: existingQ } = await supabase.from('questions').select('id, question_text').eq('pyq_year', 2022);
    const existingTexts = new Set((existingQ || []).map((q: any) => q.question_text));

    let insertedCount = 0;

    for (let q of questionsData) {
      if (existingTexts.has(q.question_text)) {
        continue;
      }

      const subjSlug = slugify(q.subject);
      let subjectId = subjectsMap[subjSlug];
      if (!subjectId) {
        const { data: nSubj, error: nSErr } = await supabase.from('subjects').insert({ name: q.subject, slug: subjSlug }).select('id').single();
        if (nSErr) throw nSErr;
        subjectId = nSubj.id;
        subjectsMap[subjSlug] = subjectId;
      }
      
      const topicSlug = slugify(q.topic);
      const topicKey = `${subjectId}:${topicSlug}`;
      let topicId = topicsMap[topicKey];
      if (!topicId) {
        const { data: nTop, error: nTErr } = await supabase.from('topics').insert({ name: q.topic, subject_id: subjectId, slug: topicSlug }).select('id').single();
        if (nTErr) throw nTErr;
        topicId = nTop.id;
        topicsMap[topicKey] = topicId;
      }

      const qToInsert = {
        subject_id: subjectId,
        topic_id: topicId,
        q_type: q.q_type,
        pyq_year: q.pyq_year,
        difficulty: q.difficulty,
        marks: q.marks,
        negative_marks: q.negative_marks,
        question_text: q.question_text,
        options: q.options,
        correct_options: q.correct_answer_range ? [`${q.correct_answer_range[0]}-${q.correct_answer_range[1]}`] : q.correct_options,
        explanation: q.explanation
      };

      const { error: insErr } = await supabase.from('questions').insert(qToInsert);
      if (insErr) throw insErr;
      insertedCount++;
    }

    logs.push(`Successfully inserted ${insertedCount} new questions into database.`);
    return NextResponse.json({ success: true, logs, totalParsed: questionsData.length, insertedCount });
  } catch (error: any) {
    console.error('Seeder Error:', error);
    return NextResponse.json({ success: false, error: error.message, logs }, { status: 500 });
  }
}
