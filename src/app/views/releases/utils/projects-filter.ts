import { Project } from '../../../models/project';

export function ProjectsFilterFn(filter: string) {
  filter = filter.toLowerCase();
  function compare(value: string): boolean {
    value = value.toLowerCase();
    return (filter.includes(value) || value.includes(filter));
  }
  return (project: Project) => (
    compare(project.name) ||
    compare(project.latest.version) ||
    (project.next && compare(project.next.version))
  );
}
