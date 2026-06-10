import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const transcriptPath = 'C:\\Users\\HP\\.gemini\\antigravity-ide\\brain\\6734a3cc-ce37-49ee-8650-27b2ad2408c7\\.system_generated\\logs\\transcript.jsonl';
    
    if (!fs.existsSync(transcriptPath)) {
      return NextResponse.json({ error: 'Transcript file not found' }, { status: 404 });
    }

    const content = fs.readFileSync(transcriptPath, 'utf8');
    const lines = content.split('\n').filter(Boolean);
    
    let extractedContent = '';
    
    for (const line of lines) {
      try {
        const obj = JSON.parse(line);
        if (obj.type === 'USER_INPUT' && obj.content && obj.content.includes('Add these questions in pyqs section as admin do properly:')) {
          extractedContent = obj.content;
          break;
        }
      } catch (e) {
        // ignore parse error for individual lines
      }
    }

    if (!extractedContent) {
      return NextResponse.json({ error: 'Could not find the prompt in the transcript' }, { status: 404 });
    }

    // The extractedContent has <USER_REQUEST> tags and might have \n
    // Let's write it to 2021_raw_full.txt
    const outPath = path.join(process.cwd(), 'scripts', '2021_raw_full.txt');
    fs.writeFileSync(outPath, extractedContent, 'utf8');

    return NextResponse.json({ success: true, message: 'Extracted successfully to scripts/2021_raw_full.txt', byteLength: Buffer.byteLength(extractedContent, 'utf8') });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
