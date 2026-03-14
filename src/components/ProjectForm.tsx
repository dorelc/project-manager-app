'use client';

import { FormEvent, useState } from 'react';
import type { ProjectStatus } from '@/types/project';

const initialState = {
  name: '',
  description: '',
  owner: '',
  due_date: '',
  status: 'planned' as ProjectStatus,
};

type Props = {
  onCreated: () => Promise<void> | void;
};

export function ProjectForm({ onCreated }: Props) {
  const [form, setForm] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? 'Nu am putut crea proiectul.');
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
          <h2>Proiect nou</h2>
          <p>Adaugă rapid un proiect și începe să urmărești task-urile.</p>
        </div>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          <span>Nume proiect</span>
          <input
            required
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Ex: Website pentru client"
          />
        </label>

        <label>
          <span>Owner</span>
          <input
            value={form.owner}
            onChange={(event) => setForm((current) => ({ ...current, owner: event.target.value }))}
            placeholder="Ex: Andrei"
          />
        </label>

        <label className="form-grid__full">
          <span>Descriere</span>
          <textarea
            rows={4}
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            placeholder="Obiectiv, livrabile, observații"
          />
        </label>

        <label>
          <span>Termen limită</span>
          <input
            type="date"
            value={form.due_date}
            onChange={(event) => setForm((current) => ({ ...current, due_date: event.target.value }))}
          />
        </label>

        <label>
          <span>Status</span>
          <select
            value={form.status}
            onChange={(event) =>
              setForm((current) => ({ ...current, status: event.target.value as ProjectStatus }))
            }
          >
            <option value="planned">Planificat</option>
            <option value="active">Activ</option>
            <option value="on_hold">În așteptare</option>
            <option value="completed">Finalizat</option>
          </select>
        </label>

        <div className="form-actions form-grid__full">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Se salvează...' : 'Creează proiect'}
          </button>
        </div>

        {error ? <p className="form-error">{error}</p> : null}
      </form>
    </section>
  );
}
