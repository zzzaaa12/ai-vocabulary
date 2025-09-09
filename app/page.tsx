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
      <div className="d-flex align-items-center mb-3">
        <h1 className="h3 mb-0"><i className="bi bi-journal-text me-2"></i>單字清單</h1>
        <div className="ms-auto d-flex align-items-center gap-2">
          <div className="input-group">
            <span className="input-group-text"><i className="bi bi-search"></i></span>
            <input className="form-control" placeholder="搜尋英文/中文/定義" value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <Link className="btn btn-primary" href="/words/new"><i className="bi bi-plus-circle me-1"></i>新增單字</Link>
        </div>
      </div>

      {loading && <div className="text-muted">載入中...</div>}
      {error && <div className="alert alert-danger py-2 my-2 mb-0">{error}</div>}

      <div className="card">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
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
                  <td className="fw-semibold text-primary">{w.word}</td>
                  <td className="text-muted">{w.phonetic || ''}</td>
                  <td>{w.chinese_meaning}</td>
                  <td className="text-end">
                    <Link href={`/words/${w.id}`} className="btn btn-outline-primary btn-sm"><i className="bi bi-pencil-square me-1"></i>編輯</Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="text-muted">無資料</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
