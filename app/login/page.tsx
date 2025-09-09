"use client";
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${siteUrl}` } });
      if (error) throw error;
      setMessage('登入連結已寄送到您的 Email，請前往收件匣確認。');
    } catch (e: any) {
      setError(e.message || '登入失敗');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y" style={{maxWidth: 420}}>
      <h1>登入</h1>
      <form onSubmit={handleLogin} className="space-y">
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <button className="btn primary" type="submit" disabled={loading}>{loading ? '送出中...' : '以 Email 連結登入'}</button>
      </form>
      {message && <div className="card">{message}</div>}
      {error && <div className="card" style={{borderColor: '#f66', color: '#900'}}>{error}</div>}
    </div>
  );
}

