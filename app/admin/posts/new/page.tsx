import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-options';
import { PostForm } from '@/components/post-form';

export default async function NewPostPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  return (
    <section className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Novo post</h1>
      <PostForm mode="create" />
    </section>
  );
}
