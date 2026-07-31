import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export default async function HomePage() {
  let posts: { id: string; title: string; slug: string; excerpt: string | null; createdAt: Date }[] = [];
  try {
    posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, slug: true, excerpt: true, createdAt: true },
    });
  } catch {
    // Database not yet provisioned (e.g. first deploy before schema migration).
    // Render empty list so the build succeeds; content appears once DB is ready.
  }

  return (
    <div>
      {/* Hero */}
      <section className="text-center py-16 mb-12">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          ✍️ Blog
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Bem-vindo ao Blog
        </h1>
        <p className="text-xl text-gray-500 max-w-xl mx-auto">
          Artigos, ideias e reflexões sobre tecnologia e desenvolvimento.
        </p>
      </section>

      {/* Posts */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Posts recentes</h2>
          <span className="text-sm text-gray-500">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </span>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhum post publicado ainda</h3>
            <p className="text-gray-400">Os posts aparecerão aqui quando forem publicados.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col"
              >
                <div className="flex-1">
                  <time className="text-xs font-medium text-indigo-500 uppercase tracking-wide">
                    {formatDate(post.createdAt)}
                  </time>
                  <h2 className="text-xl font-bold text-gray-900 mt-2 mb-2 leading-snug">
                    <Link
                      href={`/post/${post.slug}`}
                      className="hover:text-indigo-600 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  {post.excerpt ? (
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  ) : null}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Link
                    href={`/post/${post.slug}`}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    Ler artigo →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
