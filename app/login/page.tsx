import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { LoginForm } from '@/components/login-form';

export default async function LoginPage() {
  const session = await getServerSession(authOptions as any);
  if (session?.user) redirect('/admin');

  return (
    <section className="max-w-md mx-auto bg-white border rounded p-6">
      <h1 className="text-2xl font-bold mb-4">Entrar</h1>
      <LoginForm />
    </section>
  );
}
