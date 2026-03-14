import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import type { TaskStatus } from '@/types/project';

const allowedStatuses: TaskStatus[] = ['todo', 'doing', 'done'];

export const runtime = 'nodejs';

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: Context) {
  const { id } = await context.params;
  const body = await request.json();
  const updates: Record<string, string | null> = {};

  if (typeof body.title === 'string') {
    const title = body.title.trim();
    if (!title) {
      return NextResponse.json({ error: 'Titlul task-ului nu poate fi gol.' }, { status: 400 });
    }
    updates.title = title;
  }

  if (typeof body.details === 'string' || body.details === null) {
    updates.details = body.details ? String(body.details).trim() : null;
  }

  if (typeof body.assignee === 'string' || body.assignee === null) {
    updates.assignee = body.assignee ? String(body.assignee).trim() : null;
  }

  if (typeof body.status === 'string') {
    const status = body.status as TaskStatus;
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'Status invalid.' }, { status: 400 });
    }
    updates.status = status;
  }

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select('id, project_id, title, details, status, assignee, created_at')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(_request: NextRequest, context: Context) {
  const { id } = await context.params;
  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from('tasks').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
