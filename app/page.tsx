import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let posts: { id: string; title: string; slug: string; excerpt: string | null }[] = [];
  try {
    posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, slug: true, excerpt: true },
    });
  } catch {
    // Database not yet provisioned (e.g. first deploy before schema migration).
    // Render empty list so the build succeeds; content appears once DB is ready.
  }

  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">Posts</h1>
      {posts.length === 0 ? (
        <p>Nenhum post publicado ainda.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.id} className="bg-white border rounded p-4">
              <h2 className="text-xl font-semibold">
                <Link href={`/post/${post.slug}`}>{post.title}</Link>
              </h2>
              {post.excerpt ? <p className="text-gray-600 mt-2">{post.excerpt}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
