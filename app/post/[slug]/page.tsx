import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

type Props = { params: { slug: string } };

export default async function PostPage({ params }: Props) {
  const post = await prisma.post.findFirst({
    where: { slug: params.slug, published: true },
  });

  if (!post) return notFound();

  return (
    <article className="prose max-w-none">
      <h1>{post.title}</h1>
      {post.excerpt ? <p>{post.excerpt}</p> : null}
      <hr />
      <div className="whitespace-pre-wrap">{post.content}</div>
    </article>
  );
}
