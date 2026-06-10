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
    
    // Reverse to get the latest message
    for (let i = lines.length - 1; i >= 0; i--) {
      try {
        const obj = JSON.parse(lines[i]);
        if (obj.type === 'USER_INPUT' && obj.content && obj.content.includes('I already gave them to you!')) {
          extractedContent = obj.content;
          break;
        }
      } catch (e) {
        // ignore
      }
    }

    if (!extractedContent) {
      return NextResponse.json({ error: 'Could not find the prompt in the transcript' }, { status: 404 });
    }

    const outPath = path.join(process.cwd(), 'scripts', '2021_raw_full.txt');
    fs.writeFileSync(outPath, extractedContent, 'utf8');

    return NextResponse.json({ success: true, message: 'Extracted successfully', byteLength: Buffer.byteLength(extractedContent, 'utf8') });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
