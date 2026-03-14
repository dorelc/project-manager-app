import { formatProjectStatus, formatTaskStatus } from '@/lib/format';

type Props = {
  value: string;
  kind: 'project' | 'task';
};

export function StatusBadge({ value, kind }: Props) {
  const label = kind === 'project' ? formatProjectStatus(value) : formatTaskStatus(value);

  return <span className={`badge badge--${value}`}>{label}</span>;
}
