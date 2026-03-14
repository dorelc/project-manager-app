const projectStatusMap: Record<string, string> = {
  planned: 'Planificat',
  active: 'Activ',
  on_hold: 'În așteptare',
  completed: 'Finalizat',
};

const taskStatusMap: Record<string, string> = {
  todo: 'De făcut',
  doing: 'În lucru',
  done: 'Gata',
};

export function formatProjectStatus(status: string) {
  return projectStatusMap[status] ?? status;
}

export function formatTaskStatus(status: string) {
  return taskStatusMap[status] ?? status;
}

export function formatDate(value: string | null) {
  if (!value) return '—';

  try {
    return new Intl.DateTimeFormat('ro-RO', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(new Date(value));
  } catch {
    return value;
  }
}
