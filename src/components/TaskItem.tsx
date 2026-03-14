'use client';

import { useState } from 'react';
import type { TaskStatus } from '@/types/project';
import { StatusBadge } from '@/components/StatusBadge';

type Props = {
  task: {
    id: string;
    title: string;
    details: string | null;
    assignee: string | null;
    status: TaskStatus;
  };
  onChanged: () => Promise<void> | void;
};

export function TaskItem({ task, onChanged }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function updateStatus(status: TaskStatus) {
    setBusy(true);
    setError('');

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? 'Nu am putut actualiza statusul task-ului.');
      }

      await onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'A apărut o eroare.');
    } finally {
      setBusy(false);
    }
  }

  async function deleteTask() {
    const confirmed = window.confirm(`Ștergi task-ul „${task.title}”?`);
    if (!confirmed) return;

    setBusy(true);
    setError('');

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? 'Nu am putut șterge task-ul.');
      }

      await onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'A apărut o eroare.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className="task-item">
      <div className="task-item__top">
        <div>
          <h3>{task.title}</h3>
          <p>{task.details || 'Fără detalii suplimentare.'}</p>
        </div>
        <StatusBadge value={task.status} kind="task" />
      </div>

      <div className="task-item__bottom">
        <span>Responsabil: {task.assignee || '—'}</span>

        <div className="inline-actions">
          <select
            aria-label={`Status pentru ${task.title}`}
            value={task.status}
            disabled={busy}
            onChange={(event) => updateStatus(event.target.value as TaskStatus)}
          >
            <option value="todo">De făcut</option>
            <option value="doing">În lucru</option>
            <option value="done">Gata</option>
          </select>

          <button className="danger-button" type="button" onClick={deleteTask} disabled={busy}>
            Șterge
          </button>
        </div>
      </div>

      {error ? <p className="form-error">{error}</p> : null}
    </li>
  );
}
