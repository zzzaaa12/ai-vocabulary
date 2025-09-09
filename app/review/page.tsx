"use client";
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

type Word = {
  id: string;
  word: string;
  phonetic?: string;
  chinese_meaning: string;
  is_difficult?: boolean;
};

const BATCH_SIZE = 20;

export default function ReviewPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [batchIndex, setBatchIndex] = useState(0);
  const [showPhonetic, setShowPhonetic] = useState(true);
  const [showMeaning, setShowMeaning] = useState(true);
  const [hiddenAll, setHiddenAll] = useState(false);
  const [difficult, setDifficult] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('words').select('id,word,phonetic,chinese_meaning,is_difficult').order('created_at', { ascending: false });
        if (error) throw error;
        setWords(data || []);
        // seed difficult map
        const map: Record<string, boolean> = {};
        (data || []).forEach(w => { if (w.is_difficult) map[w.id] = true; });
        setDifficult(map);
      } catch (e: any) {
        setError(e.message || '載入失敗');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalBatches = useMemo(() => Math.ceil(words.length / BATCH_SIZE), [words.length]);
  const rangeStart = batchIndex * BATCH_SIZE + 1;
  const rangeEnd = Math.min((batchIndex + 1) * BATCH_SIZE, words.length);
  const progress = words.length ? Math.round(((batchIndex) / Math.max(totalBatches, 1)) * 100) : 0;
  const currentBatch = words.slice(batchIndex * BATCH_SIZE, (batchIndex + 1) * BATCH_SIZE);
  const difficultCount = Object.values(difficult).filter(Boolean).length;

  function toggleReveal(el: HTMLElement) {
    el.classList.toggle('revealed');
  }

  function toggleAll() {
    setHiddenAll(v => !v);
  }

  function markDifficult(id: string) {
    setDifficult(prev => ({ ...prev, [id]: !prev[id] }));
  }

  async function persistDifficult(id: string, value: boolean) {
    try {
      await supabase.from('words').update({ is_difficult: value }).eq('id', id);
    } catch {
      // ignore for now
    }
  }

  useEffect(() => {
    // persist changes lazily
    const ids = Object.keys(difficult);
    ids.forEach(id => {
      const value = difficult[id];
      persistDifficult(id, value);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficult]);

  if (loading) return <div className="muted">載入中...</div>;
  if (error) return <div className="card" style={{borderColor:'#f66', color:'#900'}}>{error}</div>;
  if (words.length === 0) return <div>尚無單字可複習，先新增幾個吧！</div>;

  return (
    <div className="space-y">
      <div className="row" style={{alignItems: 'center'}}>
        <h1 style={{margin: 0}}>隨機複習</h1>
        <div style={{marginLeft: 'auto'}} className="space-x">
          <label><input type="checkbox" checked={showPhonetic} onChange={e => setShowPhonetic(e.target.checked)} /> 顯示音標</label>
          <label><input type="checkbox" checked={showMeaning} onChange={e => setShowMeaning(e.target.checked)} /> 顯示中文</label>
          <button className="btn" onClick={toggleAll}>{hiddenAll ? '全部顯示' : '全部隱藏'}</button>
        </div>
      </div>

      <div className="muted">第 {batchIndex + 1} 批（{rangeStart}-{rangeEnd} / {words.length}）</div>
      <div className="card">
        <div className="review-grid">
          {currentBatch.map(w => (
            <div key={w.id} className="review-row" data-word-id={w.id}>
              <div style={{fontWeight: 600, color: '#0d6efd'}}>{w.word}</div>
              <div style={{display: showPhonetic ? 'block' : 'none'}}>
                <span className={`phonetic ${hiddenAll ? 'hidden-content' : ''}`} onClick={(e) => toggleReveal(e.currentTarget as any)}>{w.phonetic || ''}</span>
              </div>
              <div style={{display: showMeaning ? 'block' : 'none'}}>
                <span className={`meaning ${hiddenAll ? 'hidden-content' : ''}`} onClick={(e) => toggleReveal(e.currentTarget as any)}>{w.chinese_meaning}</span>
              </div>
              <div style={{textAlign: 'right'}}>
                <span className={`star ${difficult[w.id] ? 'marked' : ''}`} onClick={() => markDifficult(w.id)}>★</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="row" style={{alignItems: 'center'}}>
        <div>困難標記：{difficultCount}</div>
        <div style={{marginLeft: 'auto'}} className="space-x">
          <button className="btn" disabled={batchIndex === 0} onClick={() => setBatchIndex(b => Math.max(0, b - 1))}>上一批</button>
          <button className="btn primary" disabled={batchIndex >= totalBatches - 1} onClick={() => setBatchIndex(b => Math.min(totalBatches - 1, b + 1))}>下一批</button>
        </div>
      </div>

      <div className="card">
        <div className="muted">進度</div>
        <div style={{height: 8, background: '#eee', borderRadius: 4}}>
          <div style={{width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #28a745, #20c997)'}} />
        </div>
      </div>
    </div>
  );
}

