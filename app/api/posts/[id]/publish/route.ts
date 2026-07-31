import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const form = await req.formData();
  const published = form.get('published') === 'true';

  try {
    const post = await prisma.post.update({ where: { id: params.id }, data: { published } });
    revalidatePath('/');
    revalidatePath(`/post/${post.slug}`);
    return NextResponse.redirect(new URL('/admin', req.url));
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
