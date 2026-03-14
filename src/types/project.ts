export type ProjectStatus = 'planned' | 'active' | 'on_hold' | 'completed';
export type TaskStatus = 'todo' | 'doing' | 'done';

export type Project = {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  owner: string | null;
  due_date: string | null;
  created_at: string;
  tasks?: Task[];
};

export type Task = {
  id: string;
  project_id: string;
  title: string;
  details: string | null;
  status: TaskStatus;
  assignee: string | null;
  created_at: string;
};
