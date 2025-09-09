"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function NewWordPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    word: '',
    chinese_meaning: '',
    english_meaning: '',
    phonetic: '',
    example_sentence: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiProvider, setAiProvider] = useState<'openai' | 'gemini'>('openai');

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) router.push('/login');
    })();
  }, [router]);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // get current user to set user_id
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('words').insert([{
        user_id: user?.id,
        word: form.word.trim(),
        chinese_meaning: form.chinese_meaning.trim(),
        english_meaning: form.english_meaning.trim() || null,
        phonetic: form.phonetic.trim() || null,
        example_sentence: form.example_sentence.trim() || null
      }]);
      if (error) throw error;
      router.push('/');
    } catch (e: any) {
      setError(e.message || '建立失敗');
    } finally {
      setLoading(false);
    }
  }

  async function handleAiLookup() {
    if (!form.word.trim()) { setError('請先輸入單字再查詢 AI'); return; }
    setAiLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: form.word.trim(), provider: aiProvider })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'AI 查詢失敗');
      const r = json.result || {};
      setForm(prev => ({
        ...prev,
        chinese_meaning: r.chinese_meaning ?? prev.chinese_meaning,
        english_meaning: r.english_meaning ?? prev.english_meaning,
        phonetic: r.phonetic ?? prev.phonetic,
        example_sentence: r.example_sentence ?? prev.example_sentence,
      }));
    } catch (e: any) {
      setError(e.message || 'AI 查詢失敗');
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="mx-auto" style={{maxWidth: 720}}>
      <h1 className="h3 mb-3"><i className="bi bi-plus-circle me-2"></i>新增單字</h1>
      <div className="card mb-3 p-3">
        <div className="d-flex align-items-center">
          <div className="fw-semibold">AI 快速查詢</div>
          <div className="ms-auto">
            <select className="form-select form-select-sm" style={{maxWidth: 160}} value={aiProvider} onChange={e => setAiProvider(e.target.value as any)}>
              <option value="openai">OpenAI</option>
              <option value="gemini">Gemini</option>
            </select>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2 mt-2">
          <button className="btn btn-outline-primary btn-sm" onClick={handleAiLookup} disabled={aiLoading}><i className="bi bi-magic me-1"></i>{aiLoading ? '查詢中...' : '填入建議'}</button>
          <span className="text-muted small">需要在環境變數設定 OPENAI_API_KEY 或 GOOGLE_API_KEY</span>
        </div>
      </div>
      <form className="space-y" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">單字</label>
          <input className="form-control" value={form.word} onChange={e => update('word', e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">中文意義</label>
          <input className="form-control" value={form.chinese_meaning} onChange={e => update('chinese_meaning', e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">英文定義</label>
          <input className="form-control" value={form.english_meaning} onChange={e => update('english_meaning', e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">音標</label>
          <input className="form-control" value={form.phonetic} onChange={e => update('phonetic', e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">例句</label>
          <textarea className="form-control" rows={3} value={form.example_sentence} onChange={e => update('example_sentence', e.target.value)} />
        </div>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" type="button" onClick={() => history.back()}>取消</button>
          <button className="btn btn-primary" disabled={loading} type="submit">{loading ? '儲存中...' : '建立'}</button>
        </div>
      </form>
    </div>
  );
}
