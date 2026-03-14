import { ProjectDetails } from '@/components/ProjectDetails';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;

  return <ProjectDetails projectId={id} />;
}
