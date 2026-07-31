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

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

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
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (mode === 'create') {
      setSlug(generateSlug(newTitle));
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
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

    setSuccess(true);
    router.push('/admin');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-2xl border shadow-sm p-6 lg:p-8">
      {/* Title — full width */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Título <span className="text-red-500">*</span>
        </label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          placeholder="Digite o título do post"
          value={title}
          onChange={handleTitleChange}
          required
        />
      </div>

      {/* Two-column layout on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Left: content textarea */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Conteúdo <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm min-h-[520px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-y font-mono leading-relaxed"
            placeholder="Escreva o conteúdo completo do post aqui..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        {/* Right: sidebar with slug, excerpt, actions */}
        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="meu-post-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
            <p className="text-xs text-gray-400 mt-1">URL: /post/meu-post-slug</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Resumo{' '}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-y"
              placeholder="Uma breve descrição do post (aparece na listagem)"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              maxLength={300}
            />
            <p className="text-xs text-gray-400 mt-1">{excerpt.length}/300 caracteres</p>
          </div>

          {error ? (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          ) : null}

          {success ? (
            <div className="flex items-start gap-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
              <span>✅</span>
              <span>Post salvo com sucesso!</span>
            </div>
          ) : null}

          <div className="pt-1">
            <button
              className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors"
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <>
                  <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar post'
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
