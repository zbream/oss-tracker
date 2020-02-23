import fetch from 'node-fetch';

import { NewProject, ProjectData } from '../../models';
import { ProjectRetrieverService } from './interfaces';

const NPM_API_URL = 'https://registry.npmjs.org';
const NPM_LATEST_TAG = 'latest';

const HEADERS = {
  Accept: 'application/json',
  // Accept' 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*',
};

interface NpmPackageResponse {
  name: string;
  'dist-tags': {
    latest: string;
    [key: string]: string | undefined;
  };
  time: {
    [key: string]: string | undefined;
  };
}

export class HttpProjectRetrieverService implements ProjectRetrieverService {

  async retrieveProject(project: NewProject): Promise<ProjectData | undefined> {

    const url = this._createNpmUrl(project.name);

    try {
      const response = await fetch(url, {
        headers: HEADERS,
      });

      if (response.status !== 200) {
        throw new Error(`Unable to retrieve project: "${response.status} ${response.statusText}"`);
      }

      const responsePackage: NpmPackageResponse = await response.json();
      const responseVersions = responsePackage['dist-tags'];
      const responseDates = responsePackage.time;

      // latest (required)
      const latestTag = NPM_LATEST_TAG;
      const latestVersion = responseVersions[latestTag];
      const latestDate = new Date(Date.parse(responseDates[latestVersion]!));

      // next (optional)
      const nextTag = project.nextTag;
      let nextVersion: string | undefined;
      let nextDate: Date | undefined;
      if (nextTag !== undefined && nextTag in responseVersions) {
        nextVersion = responseVersions[nextTag]!;
        nextDate = new Date(Date.parse(responseDates[nextVersion]!));
      }

      const projectData: ProjectData = {
        latestVersion,
        latestDate,
        nextVersion,
        nextDate,
      };
      return projectData;

    } catch (err) {
      // some unknown non-network error
      console.warn(err);
      return undefined;
    }
  }

  private _createNpmUrl(packageName: string): string {
    const uriComponent = encodeURIComponent(packageName).replace('%40', '@');
    return `${NPM_API_URL}/${uriComponent}`;
  }

}
