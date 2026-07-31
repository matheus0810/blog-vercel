import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth-options';
import { PostForm } from '@/components/post-form';
import { prisma } from '@/lib/prisma';

type Props = { params: { id: string } };

export default async function EditPostPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) return notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-6"
      >
        ← Voltar ao admin
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar post</h1>
      <PostForm
        mode="edit"
        post={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? '',
          content: post.content,
        }}
      />
    </div>
  );
}
