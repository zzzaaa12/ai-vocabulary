export const metadata = {
  title: 'AI Vocabulary Review',
  description: 'Study and manage words with Supabase on Vercel',
};

import './globals.css';
import NavBar from '../components/NavBar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant" data-theme="orange">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
          crossOrigin="anonymous"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
          rel="stylesheet"
        />
        <link href="/css/themes.css" rel="stylesheet" />
      </head>
      <body>
        <NavBar />
        <main className="container py-4">{children}</main>
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
