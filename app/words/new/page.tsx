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
    <div style={{maxWidth: 720}}>
      <h1>新增單字</h1>
      <div className="card" style={{marginBottom: 16}}>
        <div className="row" style={{alignItems: 'center'}}>
          <div className="col"><strong>AI 快速查詢</strong></div>
          <div className="col" style={{textAlign: 'right'}}>
            <select className="input" style={{maxWidth: 160}} value={aiProvider} onChange={e => setAiProvider(e.target.value as any)}>
              <option value="openai">OpenAI</option>
              <option value="gemini">Gemini</option>
            </select>
          </div>
        </div>
        <div className="space-x" style={{marginTop: 8}}>
          <button className="btn" onClick={handleAiLookup} disabled={aiLoading}>{aiLoading ? '查詢中...' : '填入建議'}</button>
          <span className="muted">需要在環境變數設定 OPENAI_API_KEY 或 GOOGLE_API_KEY</span>
        </div>
      </div>
      <form className="space-y" onSubmit={handleSubmit}>
        <div>
          <label className="label">單字</label>
          <input className="input" value={form.word} onChange={e => update('word', e.target.value)} required />
        </div>
        <div>
          <label className="label">中文意義</label>
          <input className="input" value={form.chinese_meaning} onChange={e => update('chinese_meaning', e.target.value)} required />
        </div>
        <div>
          <label className="label">英文定義</label>
          <input className="input" value={form.english_meaning} onChange={e => update('english_meaning', e.target.value)} />
        </div>
        <div>
          <label className="label">音標</label>
          <input className="input" value={form.phonetic} onChange={e => update('phonetic', e.target.value)} />
        </div>
        <div>
          <label className="label">例句</label>
          <textarea className="input" rows={3} value={form.example_sentence} onChange={e => update('example_sentence', e.target.value)} />
        </div>
        {error && <div className="card" style={{borderColor:'#f66', color:'#900'}}>{error}</div>}
        <div className="space-x">
          <button className="btn" type="button" onClick={() => history.back()}>取消</button>
          <button className="btn primary" disabled={loading} type="submit">{loading ? '儲存中...' : '建立'}</button>
        </div>
      </form>
    </div>
  );
}
