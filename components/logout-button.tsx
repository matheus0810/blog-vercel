'use client';

import { signOut } from 'next-auth/react';

export function LogoutButton() {
  return (
    <button
      className="border rounded px-4 py-2 text-sm"
      onClick={() => signOut({ callbackUrl: '/' })}
      type="button"
    >
      Sair
    </button>
  );
}
