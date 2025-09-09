"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function EditWordPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    word: '',
    chinese_meaning: '',
    english_meaning: '',
    phonetic: '',
    example_sentence: '',
    is_difficult: false,
  });

  function update<K extends keyof typeof form>(key: K, value: any) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const { data: auth } = await supabase.auth.getUser();
        if (!auth.user) { router.push('/login'); return; }
        const { data, error } = await supabase.from('words').select('*').eq('id', id).single();
        if (error) throw error;
        setForm({
          word: data.word || '',
          chinese_meaning: data.chinese_meaning || '',
          english_meaning: data.english_meaning || '',
          phonetic: data.phonetic || '',
          example_sentence: data.example_sentence || '',
          is_difficult: !!data.is_difficult,
        });
      } catch (e: any) {
        setError(e.message || '載入失敗');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  async function handleSave() {
    try {
      setLoading(true);
      const { error } = await supabase.from('words').update({
        word: form.word.trim(),
        chinese_meaning: form.chinese_meaning.trim(),
        english_meaning: form.english_meaning.trim() || null,
        phonetic: form.phonetic.trim() || null,
        example_sentence: form.example_sentence.trim() || null,
        is_difficult: form.is_difficult,
      }).eq('id', id);
      if (error) throw error;
      router.push('/');
    } catch (e: any) {
      setError(e.message || '儲存失敗');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm('確定刪除這個單字？')) return;
    try {
      setLoading(true);
      const { error } = await supabase.from('words').delete().eq('id', id);
      if (error) throw error;
      router.push('/');
    } catch (e: any) {
      setError(e.message || '刪除失敗');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="muted">載入中...</div>;

  return (
    <div className="mx-auto" style={{maxWidth: 720}}>
      <h1 className="h3 mb-3"><i className="bi bi-pencil-square me-2"></i>編輯單字</h1>
      {error && <div className="alert alert-danger py-2">{error}</div>}
      <div className="space-y">
        <div className="mb-3">
          <label className="form-label">單字</label>
          <input className="form-control" value={form.word} onChange={e => update('word', e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">中文意義</label>
          <input className="form-control" value={form.chinese_meaning} onChange={e => update('chinese_meaning', e.target.value)} />
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
        <div className="form-check mb-3">
          <input id="chkDiff" className="form-check-input" type="checkbox" checked={form.is_difficult} onChange={e => update('is_difficult', e.target.checked)} />
          <label className="form-check-label" htmlFor="chkDiff">標為困難</label>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={() => history.back()}>返回</button>
          <button className="btn btn-primary" onClick={handleSave}>儲存</button>
          <button className="btn btn-warning" onClick={handleDelete}><i className="bi bi-trash me-1"></i>刪除</button>
        </div>
      </div>
    </div>
  );
}
