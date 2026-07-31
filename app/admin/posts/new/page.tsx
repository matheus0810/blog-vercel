import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-options';
import { PostForm } from '@/components/post-form';

export default async function NewPostPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-6"
      >
        ← Voltar ao admin
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Novo post</h1>
      <PostForm mode="create" />
    </div>
  );
}
