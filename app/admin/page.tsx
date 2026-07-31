import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { LogoutButton } from '@/components/logout-button';

export default async function AdminPage() {
  const session = await getServerSession(authOptions as any);
  if (!session?.user) redirect('/login');

  const posts = await prisma.post.findMany({ orderBy: { updatedAt: 'desc' } });

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin</h1>
        <div className="flex gap-2">
          <Link href="/admin/posts/new" className="bg-black text-white rounded px-4 py-2 text-sm">
            Novo post
          </Link>
          <LogoutButton />
        </div>
      </div>

      <div className="bg-white border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Título</th>
              <th className="p-3">Status</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-t">
                <td className="p-3">{post.title}</td>
                <td className="p-3">{post.published ? 'Publicado' : 'Rascunho'}</td>
                <td className="p-3 flex gap-3">
                  <Link className="underline" href={`/admin/posts/${post.id}/edit`}>
                    Editar
                  </Link>
                  {post.published ? (
                    <form action={`/api/posts/${post.id}/publish`} method="post">
                      <input type="hidden" name="published" value="false" />
                      <button className="underline" type="submit">Despublicar</button>
                    </form>
                  ) : (
                    <form action={`/api/posts/${post.id}/publish`} method="post">
                      <input type="hidden" name="published" value="true" />
                      <button className="underline" type="submit">Publicar</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
