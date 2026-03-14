import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import type { ProjectStatus } from '@/types/project';

const allowedStatuses: ProjectStatus[] = ['planned', 'active', 'on_hold', 'completed'];

export const runtime = 'nodejs';

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: Context) {
  const { id } = await context.params;
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('projects')
    .select('id, name, description, status, owner, due_date, created_at, tasks(id, project_id, title, details, status, assignee, created_at)')
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  const project = {
    ...data,
    tasks: [...(data.tasks ?? [])].sort((a, b) => {
      if (a.status === b.status) {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      const rank: Record<string, number> = { todo: 0, doing: 1, done: 2 };
      return rank[a.status] - rank[b.status];
    }),
  };

  return NextResponse.json(project);
}

export async function PATCH(request: NextRequest, context: Context) {
  const { id } = await context.params;
  const body = await request.json();
  const updates: Record<string, string | null> = {};

  if (typeof body.name === 'string') {
    const name = body.name.trim();
    if (!name) {
      return NextResponse.json({ error: 'Numele proiectului nu poate fi gol.' }, { status: 400 });
    }
    updates.name = name;
  }

  if (typeof body.description === 'string' || body.description === null) {
    updates.description = body.description ? String(body.description).trim() : null;
  }

  if (typeof body.owner === 'string' || body.owner === null) {
    updates.owner = body.owner ? String(body.owner).trim() : null;
  }

  if (typeof body.due_date === 'string' || body.due_date === null) {
    updates.due_date = body.due_date || null;
  }

  if (typeof body.status === 'string') {
    const status = body.status as ProjectStatus;
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'Status invalid.' }, { status: 400 });
    }
    updates.status = status;
  }

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select('id, name, description, status, owner, due_date, created_at')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(_request: NextRequest, context: Context) {
  const { id } = await context.params;
  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from('projects').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
