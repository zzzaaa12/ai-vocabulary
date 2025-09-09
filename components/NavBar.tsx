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
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand fw-bold" href="/">AI Vocabulary</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain" aria-controls="navMain" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navMain">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link className="nav-link" href="/review"><i className="bi bi-shuffle me-1"></i>複習</Link></li>
            <li className="nav-item"><Link className="nav-link" href="/words/new"><i className="bi bi-plus-circle me-1"></i>新增單字</Link></li>
          </ul>
          <div className="d-flex align-items-center gap-2">
            {email ? (
              <>
                <span className="text-white-50 small">{email}</span>
                <button className="btn btn-light btn-sm" onClick={() => supabase.auth.signOut()}><i className="bi bi-box-arrow-right me-1"></i>登出</button>
              </>
            ) : (
              <Link className="btn btn-outline-light btn-sm" href="/login"><i className="bi bi-box-arrow-in-right me-1"></i>登入</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
