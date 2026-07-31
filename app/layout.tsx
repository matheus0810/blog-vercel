import './globals.css';
import Link from 'next/link';
import { ReactNode } from 'react';

export const metadata = {
  title: 'blog',
  description: 'Blog simples com admin',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="flex flex-col min-h-screen">
        <header className="border-b bg-white sticky top-0 z-10 shadow-sm">
          <div className="container-page py-4 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl text-gray-900 hover:text-indigo-600 transition-colors">
              ✍️ blog
            </Link>
            <nav className="flex gap-6 text-sm font-medium">
              <Link href="/" className="text-gray-600 hover:text-indigo-600 transition-colors">
                Início
              </Link>
              <Link href="/admin" className="text-gray-600 hover:text-indigo-600 transition-colors">
                Admin
              </Link>
            </nav>
          </div>
        </header>
        <main className="container-page py-10 flex-1">{children}</main>
      </body>
    </html>
  );
}
