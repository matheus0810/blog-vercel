import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

type Props = { params: { slug: string } };

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export default async function PostPage({ params }: Props) {
  const post = await prisma.post.findFirst({
    where: { slug: params.slug, published: true },
  });

  if (!post) return notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-8"
      >
        ← Voltar ao blog
      </Link>

      <article>
        <header className="mb-8">
          <time className="text-xs font-medium text-indigo-500 uppercase tracking-wide">
            {formatDate(post.createdAt)}
          </time>
          <h1 className="text-4xl font-bold text-gray-900 mt-2 mb-4 leading-tight">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="text-xl text-gray-500 leading-relaxed border-l-4 border-indigo-200 pl-4">
              {post.excerpt}
            </p>
          ) : null}
        </header>

        <hr className="border-gray-200 mb-8" />

        <div className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">
          {post.content}
        </div>

        <hr className="border-gray-200 mt-12 mb-6" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-400">
          <span>Atualizado em {formatDate(post.updatedAt)}</span>
          <Link
            href="/"
            className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            ← Ver todos os posts
          </Link>
        </div>
      </article>
    </div>
  );
}
