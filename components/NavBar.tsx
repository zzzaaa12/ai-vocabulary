"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function NavBar() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? null);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange(async () => {
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? null);
    });
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  return (
    <nav>
      <div className="navwrap container">
        <div>
          <Link href="/" style={{ fontWeight: 700 }}>AI Vocabulary</Link>
        </div>
        <div className="links">
          <Link href="/review">複習</Link>
          <Link href="/words/new">新增單字</Link>
          {email ? (
            <>
              <span className="muted">{email}</span>
              <button className="btn" onClick={() => supabase.auth.signOut()}>登出</button>
            </>
          ) : (
            <Link href="/login">登入</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

