export const metadata = {
  title: 'AI Vocabulary Review',
  description: 'Study and manage words with Supabase on Vercel',
};

import './globals.css';
import NavBar from '../components/NavBar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>
        <NavBar />
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
