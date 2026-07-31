'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl: '/admin',
    });

    setLoading(false);

    if (res?.error) {
      setError('Email ou senha incorretos. Verifique suas credenciais.');
    } else if (res?.ok) {
      router.push('/admin');
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm mb-1">Email</label>
        <input
          className="w-full border rounded px-3 py-2"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Senha</label>
        <input
          className="w-full border rounded px-3 py-2"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error ? <p className="text-red-600 text-sm">{error}</p> : null}
      <button
        className="bg-black text-white rounded px-4 py-2 disabled:opacity-60"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  );
}
