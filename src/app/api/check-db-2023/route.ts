import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

export async function GET() {
  try {
    const { data: subjects, error: sErr } = await supabase
      .from("subjects")
      .select("id, name, slug");
    if (sErr) throw sErr;

    const { data: topics, error: tErr } = await supabase
      .from("topics")
      .select("id, subject_id, name, slug");
    if (tErr) throw tErr;

    const { data: questions, error: qErr } = await supabase
      .from("questions")
      .select("id, question_text, pyq_year, q_type, subject_id, topic_id")
      .eq("pyq_year", 2023);
    if (qErr) throw qErr;

    return NextResponse.json({
      questionsCount: questions.length,
      subjects,
      topics
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
