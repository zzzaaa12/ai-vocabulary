import { NextRequest, NextResponse } from 'next/server';

type AiResult = {
  chinese_meaning?: string;
  english_meaning?: string;
  phonetic?: string;
  example_sentence?: string;
  synonyms?: string[];
  antonyms?: string[];
};

function buildPrompt(word: string) {
  return `請根據英文單字「${word}」輸出一段 JSON，鍵包含：
  chinese_meaning（中文義）、english_meaning（英文定義，簡短）、phonetic（音標，若無可空字串）、example_sentence（一句例句）、synonyms（5 個內陣列）、antonyms（5 個內陣列）。
  僅輸出 JSON，勿加說明。`;
}

async function callOpenAI(word: string): Promise<AiResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY 未設定');
  const prompt = buildPrompt(word);
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that outputs strict JSON only.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2
    })
  });
  if (!res.ok) throw new Error(`OpenAI API 失敗: ${res.status}`);
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '';
  try { return JSON.parse(text); } catch { return {}; }
}

async function callGemini(word: string): Promise<AiResult> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_API_KEY 未設定');
  const prompt = buildPrompt(word);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });
  if (!res.ok) throw new Error(`Gemini API 失敗: ${res.status}`);
  const data = await res.json();
  const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  try { return JSON.parse(text); } catch { return {}; }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { word, provider = 'openai' } = body || {};
    if (!word || typeof word !== 'string') {
      return NextResponse.json({ error: '缺少 word' }, { status: 400 });
    }
    let result: AiResult = {};
    if (provider === 'gemini') result = await callGemini(word);
    else result = await callOpenAI(word);
    return NextResponse.json({ result });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'AI 查詢失敗' }, { status: 500 });
  }
}

