import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { LoginForm } from '@/components/login-form';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect('/admin');

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-indigo-600 transition-colors">
            ✍️ Blog Vercel
          </Link>
          <p className="text-gray-500 text-sm mt-2">Área administrativa</p>
        </div>
        <div className="bg-white rounded-2xl border shadow-sm p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-6">Entrar</h1>
          <LoginForm />
        </div>
        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
            ← Voltar ao blog
          </Link>
        </div>
      </div>
    </div>
  );
}
