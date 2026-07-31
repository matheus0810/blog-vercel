'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export function LoginForm() {
  const [email, setEmail] = useState('admin@admin.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await signIn('credentials', {
      email,
      password,
      redirect: true,
      callbackUrl: '/admin',
    });

    if (res?.error) {
      setError('Credenciais inválidas');
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm mb-1">Email</label>
        <input
          className="w-full border rounded px-3 py-2"
          type="email"
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error ? <p className="text-red-600 text-sm">{error}</p> : null}
      <button className="bg-black text-white rounded px-4 py-2" type="submit">
        Entrar
      </button>
    </form>
  );
}
