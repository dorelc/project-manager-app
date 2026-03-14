import Link from 'next/link';
import { StatusBadge } from '@/components/StatusBadge';
import { formatDate } from '@/lib/format';

type Props = {
  project: {
    id: string;
    name: string;
    description: string | null;
    owner: string | null;
    due_date: string | null;
    status: string;
    task_count: number;
  };
};

export function ProjectCard({ project }: Props) {
  return (
    <article className="card">
      <div className="card__header">
        <div>
          <h3>{project.name}</h3>
          <p>{project.description || 'Fără descriere.'}</p>
        </div>
        <StatusBadge value={project.status} kind="project" />
      </div>

      <dl className="meta-grid">
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
          <dd>{project.task_count}</dd>
        </div>
      </dl>

      <Link className="secondary-button" href={`/projects/${project.id}`}>
        Deschide proiectul
      </Link>
    </article>
  );
}
