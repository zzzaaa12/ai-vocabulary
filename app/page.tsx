"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

type Word = {
  id: string;
  word: string;
  chinese_meaning: string;
  english_meaning?: string;
  phonetic?: string;
  example_sentence?: string;
  is_difficult?: boolean;
  created_at?: string;
};

export default function HomePage() {
  const [words, setWords] = useState<Word[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchWords() {
    setLoading(true);
    setError(null);
    try {
      let req = supabase.from('words').select('*').order('created_at', { ascending: false }).limit(200);
      const { data, error } = await req;
      if (error) throw error;
      setWords(data || []);
    } catch (e: any) {
      setError(e.message || '載入失敗');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWords();
  }, []);

  const filtered = words.filter(w => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      w.word.toLowerCase().includes(q) ||
      (w.chinese_meaning || '').toLowerCase().includes(q) ||
      (w.english_meaning || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y">
      <h1>單字清單</h1>
      <div className="row">
        <div className="col">
          <input className="input" placeholder="搜尋英文/中文/定義" value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <div className="col" style={{ textAlign: 'right' }}>
          <Link className="btn primary" href="/words/new">新增單字</Link>
        </div>
      </div>

      {loading && <div className="muted">載入中...</div>}
      {error && <div className="muted">{error}</div>}

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th style={{width: '25%'}}>單字</th>
              <th style={{width: '20%'}}>音標</th>
              <th>中文意義</th>
              <th style={{width: '120px'}}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(w => (
              <tr key={w.id}>
                <td style={{fontWeight: 600}}>{w.word}</td>
                <td className="muted">{w.phonetic || ''}</td>
                <td>{w.chinese_meaning}</td>
                <td>
                  <Link href={`/words/${w.id}`} className="btn">編輯</Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={4} className="muted">無資料</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

