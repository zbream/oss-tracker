import { propertiesOf } from '../utils';

export interface NewProject
  extends Pick<Project, 'name' | 'linkUrl' | 'linkChangelog' | 'nextTag'> {}

export interface Project {
  refreshed: Date;
  name: string;
  linkUrl: string;
  linkChangelog: string;
  nextTag?: string;
  data: ProjectData;
}

export interface ProjectData {
  latestVersion: string;
  latestDate: Date;
  nextVersion?: string;
  nextDate?: Date;
}

// needed to retrieve properties from DB
export const NEW_PROJECT_PROPS = propertiesOf<NewProject>(
  'name', 'linkUrl', 'linkChangelog', 'nextTag',
);
