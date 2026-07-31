'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type FormMode = 'create' | 'edit';

type PostData = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
};

export function PostForm({
  mode,
  post,
}: {
  mode: FormMode;
  post?: PostData;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = { title, slug, excerpt, content };

    const res = await fetch(mode === 'create' ? '/api/posts' : `/api/posts/${post?.id}`, {
      method: mode === 'create' ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Erro ao salvar post');
      return;
    }

    router.push('/admin');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 bg-white border rounded p-4">
      <div>
        <label className="block text-sm mb-1">Título</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Slug</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Resumo</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Conteúdo</label>
        <textarea
          className="w-full border rounded px-3 py-2 min-h-56"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button className="bg-black text-white rounded px-4 py-2" disabled={loading} type="submit">
        {loading ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  );
}
