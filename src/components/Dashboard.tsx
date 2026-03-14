'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectForm } from '@/components/ProjectForm';

type ProjectListItem = {
  id: string;
  name: string;
  description: string | null;
  owner: string | null;
  due_date: string | null;
  status: string;
  task_count: number;
};

export function Dashboard() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProjects = useCallback(async () => {
    try {
      setError('');
      const response = await fetch('/api/projects', { cache: 'no-store' });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? 'Nu am putut încărca proiectele.');
      }

      const data = (await response.json()) as ProjectListItem[];
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'A apărut o eroare.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  const stats = useMemo(() => {
    return {
      total: projects.length,
      active: projects.filter((project) => project.status === 'active').length,
      completed: projects.filter((project) => project.status === 'completed').length,
      tasks: projects.reduce((total, project) => total + project.task_count, 0),
    };
  }, [projects]);

  return (
    <div className="page-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Proiect licenta Ana Matei</p>
          <h1>Management proiecte</h1>
          <p>
            Aplicație web simplă pentru proiecte și task-uri, cu frontend, backend și bază de date.
          </p>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span>Total proiecte</span>
          <strong>{stats.total}</strong>
        </article>
        <article className="stat-card">
          <span>Proiecte active</span>
          <strong>{stats.active}</strong>
        </article>
        <article className="stat-card">
          <span>Finalizate</span>
          <strong>{stats.completed}</strong>
        </article>
        <article className="stat-card">
          <span>Total task-uri</span>
          <strong>{stats.tasks}</strong>
        </article>
      </section>

      <ProjectForm onCreated={loadProjects} />

      <section className="panel">
        <div className="panel__header">
          <div>
            <h2>Proiecte</h2>
            <p>Vezi rapid starea proiectelor și intră în detalii.</p>
          </div>
          <button className="secondary-button" type="button" onClick={() => void loadProjects()}>
            Reîncarcă
          </button>
        </div>

        {loading ? <p>Se încarcă proiectele...</p> : null}
        {error ? <p className="form-error">{error}</p> : null}

        {!loading && !error && projects.length === 0 ? (
          <p>Nu există proiecte încă. Creează unul folosind formularul de mai sus.</p>
        ) : null}

        <div className="card-grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
