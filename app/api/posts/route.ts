import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

const postSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  excerpt: z.string().optional().or(z.literal('')),
  content: z.string().min(10),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }

  try {
    const post = await prisma.post.create({
      data: {
        ...parsed.data,
        excerpt: parsed.data.excerpt || null,
        authorId: session.user.id,
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (e: any) {
    if (e?.code === 'P2002') {
      return NextResponse.json({ error: 'Slug já existe' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
