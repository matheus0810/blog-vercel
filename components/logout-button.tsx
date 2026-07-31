'use client';

import { signOut } from 'next-auth/react';

export function LogoutButton() {
  return (
    <button
      className="border border-gray-300 hover:border-gray-400 bg-white text-gray-700 hover:text-gray-900 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
      onClick={() => signOut({ callbackUrl: '/' })}
      type="button"
    >
      Sair
    </button>
  );
}
