'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StatusBadge } from '@/components/StatusBadge';
import { TaskForm } from '@/components/TaskForm';
import { TaskItem } from '@/components/TaskItem';
import { formatDate } from '@/lib/format';
import type { ProjectStatus, Task } from '@/types/project';

const projectStatuses: { value: ProjectStatus; label: string }[] = [
  { value: 'planned', label: 'Planificat' },
  { value: 'active', label: 'Activ' },
  { value: 'on_hold', label: 'În așteptare' },
  { value: 'completed', label: 'Finalizat' },
];

type ProjectDetailsData = {
  id: string;
  name: string;
  description: string | null;
  owner: string | null;
  due_date: string | null;
  status: ProjectStatus;
  created_at: string;
  tasks: Task[];
};

type Props = {
  projectId: string;
};

export function ProjectDetails({ projectId }: Props) {
  const [project, setProject] = useState<ProjectDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const loadProject = useCallback(async () => {
    try {
      setError('');
      const response = await fetch(`/api/projects/${projectId}`, { cache: 'no-store' });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? 'Nu am putut încărca proiectul.');
      }

      const data = (await response.json()) as ProjectDetailsData;
      setProject(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'A apărut o eroare.');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    void loadProject();
  }, [loadProject]);

  const completion = useMemo(() => {
    if (!project || project.tasks.length === 0) return 0;
    const done = project.tasks.filter((task) => task.status === 'done').length;
    return Math.round((done / project.tasks.length) * 100);
  }, [project]);

  async function updateProjectStatus(status: ProjectStatus) {
    setBusy(true);
    setError('');

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? 'Nu am putut actualiza proiectul.');
      }

      await loadProject();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'A apărut o eroare.');
    } finally {
      setBusy(false);
    }
  }

  async function deleteProject() {
    if (!project) return;

    const confirmed = window.confirm(`Ștergi proiectul „${project.name}”?`);
    if (!confirmed) return;

    setBusy(true);
    setError('');

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? 'Nu am putut șterge proiectul.');
      }

      window.location.href = '/';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'A apărut o eroare.');
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="page-shell">
        <p>Se încarcă proiectul...</p>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="page-shell">
        <Link className="secondary-button" href="/">
          Înapoi la dashboard
        </Link>
        <p className="form-error">{error}</p>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="page-shell">
      <div className="page-back-link">
        <Link className="secondary-button" href="/">
          Înapoi la dashboard
        </Link>
      </div>

      <section className="panel project-header">
        <div className="project-header__content">
          <div>
            <p className="eyebrow">Detalii proiect</p>
            <h1>{project.name}</h1>
            <p>{project.description || 'Fără descriere.'}</p>
          </div>

          <StatusBadge value={project.status} kind="project" />
        </div>

        <dl className="meta-grid meta-grid--wide">
          <div>
            <dt>Owner</dt>
            <dd>{project.owner || '—'}</dd>
          </div>
          <div>
            <dt>Deadline</dt>
            <dd>{formatDate(project.due_date)}</dd>
          </div>
          <div>
            <dt>Task-uri</dt>
            <dd>{project.tasks.length}</dd>
          </div>
          <div>
            <dt>Progres</dt>
            <dd>{completion}%</dd>
          </div>
        </dl>

        <div className="inline-actions inline-actions--space-between">
          <label className="inline-field">
            <span>Status proiect</span>
            <select
              value={project.status}
              disabled={busy}
              onChange={(event) => updateProjectStatus(event.target.value as ProjectStatus)}
            >
              {projectStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>

          <button className="danger-button" type="button" onClick={deleteProject} disabled={busy}>
            Șterge proiectul
          </button>
        </div>

        {error ? <p className="form-error">{error}</p> : null}
      </section>

      <TaskForm projectId={projectId} onCreated={loadProject} />

      <section className="panel">
        <div className="panel__header">
          <div>
            <h2>Task-uri</h2>
            <p>Actualizează rapid progresul proiectului.</p>
          </div>
        </div>

        {project.tasks.length === 0 ? <p>Nu există task-uri încă.</p> : null}

        <ul className="task-list">
          {project.tasks.map((task) => (
            <TaskItem key={task.id} task={task} onChanged={loadProject} />
          ))}
        </ul>
      </section>
    </div>
  );
}
