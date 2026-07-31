import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PostForm } from '@/components/post-form';
import { prisma } from '@/lib/prisma';

type Props = { params: { id: string } };

export default async function EditPostPage({ params }: Props) {
  const session = await getServerSession(authOptions as any);
  if (!session?.user) redirect('/login');

  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) return notFound();

  return (
    <section className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Editar post</h1>
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
    </section>
  );
}
