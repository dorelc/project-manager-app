import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import type { ProjectStatus } from '@/types/project';

const allowedStatuses: ProjectStatus[] = ['planned', 'active', 'on_hold', 'completed'];

export const runtime = 'nodejs';

export async function GET() {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('projects')
    .select('id, name, description, status, owner, due_date, created_at, tasks(count)')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const normalized = (data ?? []).map((project) => ({
    id: project.id,
    name: project.name,
    description: project.description,
    status: project.status,
    owner: project.owner,
    due_date: project.due_date,
    created_at: project.created_at,
    task_count: Array.isArray(project.tasks) ? project.tasks[0]?.count ?? 0 : 0,
  }));

  return NextResponse.json(normalized);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const name = String(body.name ?? '').trim();
  const description = body.description ? String(body.description).trim() : null;
  const owner = body.owner ? String(body.owner).trim() : null;
  const dueDate = body.due_date ? String(body.due_date) : null;
  const status = String(body.status ?? 'planned') as ProjectStatus;

  if (!name) {
    return NextResponse.json({ error: 'Numele proiectului este obligatoriu.' }, { status: 400 });
  }

  if (!allowedStatuses.includes(status)) {
    return NextResponse.json({ error: 'Status invalid.' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('projects')
    .insert({
      name,
      description,
      owner,
      due_date: dueDate || null,
      status,
    })
    .select('id, name, description, status, owner, due_date, created_at')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
