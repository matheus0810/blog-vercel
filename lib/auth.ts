import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function requireSession() {
  const session = await getServerSession(authOptions as any);
  if (!session?.user?.id) {
    throw new Error('UNAUTHORIZED');
  }
  return session;
}
