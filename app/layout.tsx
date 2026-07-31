import './globals.css';
import Link from 'next/link';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Blog Vercel',
  description: 'Blog simples com admin',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="border-b bg-white">
          <div className="container-page py-4 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl">
              Blog Vercel
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/admin">Admin</Link>
            </nav>
          </div>
        </header>
        <main className="container-page py-8">{children}</main>
      </body>
    </html>
  );
}
