import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import type { TaskStatus } from '@/types/project';

const allowedStatuses: TaskStatus[] = ['todo', 'doing', 'done'];

export const runtime = 'nodejs';

type Context = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: Context) {
  const { id } = await context.params;
  const body = await request.json();
  const title = String(body.title ?? '').trim();
  const details = body.details ? String(body.details).trim() : null;
  const assignee = body.assignee ? String(body.assignee).trim() : null;
  const status = String(body.status ?? 'todo') as TaskStatus;

  if (!title) {
    return NextResponse.json({ error: 'Titlul task-ului este obligatoriu.' }, { status: 400 });
  }

  if (!allowedStatuses.includes(status)) {
    return NextResponse.json({ error: 'Status invalid.' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      project_id: id,
      title,
      details,
      assignee,
      status,
    })
    .select('id, project_id, title, details, status, assignee, created_at')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
