import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { LogoutButton } from '@/components/logout-button';

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  const posts = await prisma.post.findMany({ orderBy: { updatedAt: 'desc' } });
  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount = posts.filter((p) => !p.published).length;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Painel Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie os posts do blog</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
          >
            + Novo post
          </Link>
          <LogoutButton />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{posts.length}</div>
          <div className="text-xs text-gray-500 mt-1">Total</div>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{publishedCount}</div>
          <div className="text-xs text-gray-500 mt-1">Publicados</div>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{draftCount}</div>
          <div className="text-xs text-gray-500 mt-1">Rascunhos</div>
        </div>
      </div>

      {/* Post list */}
      {posts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-gray-500">Nenhum post ainda. Crie seu primeiro post!</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Título
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Atualizado
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-900">{post.title}</td>
                    <td className="px-5 py-4">
                      {post.published ? (
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          ● Publicado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          ○ Rascunho
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{formatDate(post.updatedAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                        >
                          Editar
                        </Link>
                        {post.published ? (
                          <form action={`/api/posts/${post.id}/publish`} method="post">
                            <input type="hidden" name="published" value="false" />
                            <button
                              className="text-red-500 hover:text-red-600 text-sm font-medium"
                              type="submit"
                            >
                              Despublicar
                            </button>
                          </form>
                        ) : (
                          <form action={`/api/posts/${post.id}/publish`} method="post">
                            <input type="hidden" name="published" value="true" />
                            <button
                              className="text-green-600 hover:text-green-700 text-sm font-medium"
                              type="submit"
                            >
                              Publicar
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-gray-100">
            {posts.map((post) => (
              <div key={post.id} className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-medium text-gray-900 text-sm leading-snug">{post.title}</p>
                  {post.published ? (
                    <span className="shrink-0 inline-flex items-center bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                      Publicado
                    </span>
                  ) : (
                    <span className="shrink-0 inline-flex items-center bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                      Rascunho
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mb-3">Atualizado em {formatDate(post.updatedAt)}</p>
                <div className="flex gap-4">
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="text-indigo-600 text-sm font-medium"
                  >
                    Editar
                  </Link>
                  {post.published ? (
                    <form action={`/api/posts/${post.id}/publish`} method="post">
                      <input type="hidden" name="published" value="false" />
                      <button className="text-red-500 text-sm font-medium" type="submit">
                        Despublicar
                      </button>
                    </form>
                  ) : (
                    <form action={`/api/posts/${post.id}/publish`} method="post">
                      <input type="hidden" name="published" value="true" />
                      <button className="text-green-600 text-sm font-medium" type="submit">
                        Publicar
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
