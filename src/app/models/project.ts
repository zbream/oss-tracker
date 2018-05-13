export interface Project {
  id: string;
  name: string;
  latest: {
    version: string;
    date: Date;
  };
  next?: {
    version: string;
    date: Date;
  };
  links: {
    url: string;
    changelog: string;
  };
}

export interface NewProject {
  name: string;
  linkUrl: string;
  linkChangelog: string;
  nextTag?: string;
}
