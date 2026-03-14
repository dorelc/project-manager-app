'use client';

import { FormEvent, useState } from 'react';
import type { TaskStatus } from '@/types/project';

const initialState = {
  title: '',
  details: '',
  assignee: '',
  status: 'todo' as TaskStatus,
};

type Props = {
  projectId: string;
  onCreated: () => Promise<void> | void;
};

export function TaskForm({ projectId, onCreated }: Props) {
  const [form, setForm] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? 'Nu am putut crea task-ul.');
      }

      setForm(initialState);
      await onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'A apărut o eroare.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="panel">
      <div className="panel__header">
        <div>
          <h2>Task nou</h2>
          <p>Adaugă task-uri direct în proiect.</p>
        </div>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          <span>Titlu</span>
          <input
            required
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Ex: Wireframe homepage"
          />
        </label>

        <label>
          <span>Responsabil</span>
          <input
            value={form.assignee}
            onChange={(event) => setForm((current) => ({ ...current, assignee: event.target.value }))}
            placeholder="Ex: Maria"
          />
        </label>

        <label className="form-grid__full">
          <span>Detalii</span>
          <textarea
            rows={3}
            value={form.details}
            onChange={(event) => setForm((current) => ({ ...current, details: event.target.value }))}
            placeholder="Descriere scurtă"
          />
        </label>

        <label>
          <span>Status</span>
          <select
            value={form.status}
            onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as TaskStatus }))}
          >
            <option value="todo">De făcut</option>
            <option value="doing">În lucru</option>
            <option value="done">Gata</option>
          </select>
        </label>

        <div className="form-actions form-grid__full">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Se salvează...' : 'Adaugă task'}
          </button>
        </div>

        {error ? <p className="form-error">{error}</p> : null}
      </form>
    </section>
  );
}
