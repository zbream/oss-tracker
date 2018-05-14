import { Issue } from '../../../models/issue';

export function IssuesFilterFn(filter: string) {
  filter = filter.toLowerCase();
  function compare(value: string): boolean {
    value = value.toLowerCase();
    return (filter.includes(value) || value.includes(filter));
  }
  return (issue: Issue) => (
    compare(issue.project) ||
    compare(`${issue.issue}`) ||
    compare(issue.description) ||
    compare(issue.status)
  );
}
