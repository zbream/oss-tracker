import { GraphQLClient } from 'graphql-request';

import { IssueData, NewIssue } from '../../models';
import { IssueRetrieverService } from "./interfaces";

const GITHUB_URL = 'https://github.com';
const GITHUB_API_URL = 'https://api.github.com/graphql';

const GITHUB_ACCESS_TOKEN = 'd2b08172279c8263158c526ba89209d1db2da687';

const GITHUB_ISSUE_QUERY = `
query Issue($repoOwner: String!, $repoName: String!, $issueNumber: Int!) {
  repository(owner: $repoOwner, name: $repoName) {
    resourcePath
    issue(number: $issueNumber) {
      title
      resourcePath
      state
      closedAt
      publishedAt
      comments(last: 1) {
        nodes {
          publishedAt
        }
      }
    }
  }
}
`;

interface GithubIssueQueryResponse {
  repository: {
    resourcePath: string,
    issue: {
      title: string,
      resourcePath: string,
      state: string,
      closedAt?: string,
      publishedAt: string,
      comments: {
        nodes: [{
          publishedAt: string,
        } | undefined]
      }
    }
  }
}

export class HttpIssueRetrieverService implements IssueRetrieverService {

  private client: GraphQLClient;

  constructor() {
    this.client = new GraphQLClient(GITHUB_API_URL, {
      headers: {
        'User-Agent': 'OssTrackerServer (zbream)',
        'Authorization': `bearer ${GITHUB_ACCESS_TOKEN}`,
      },
    });
  }

  async retrieveIssue(issue: NewIssue): Promise<IssueData | undefined> {
    const split = this.splitOwnerAndName(issue.projectName);
    if (!split) {
      console.warn(`Cannot determine Repo Owner+Name of "${issue.projectName}".`);
      return undefined;
    }
    const [ repoOwner, repoName ] = split;
    const issueNumber = issue.issueNumber;

    try {
      const response = await this.client.request<GithubIssueQueryResponse>(
        GITHUB_ISSUE_QUERY,
        { repoOwner, repoName, issueNumber },
      );
      const responseRepo = response.repository;
      const responseIssue = response.repository.issue;

      // latest activity is determined by latest comment, then by publish date
      const latestComment = responseIssue.comments.nodes[0];
      const latestActivity = latestComment ? latestComment.publishedAt : responseIssue.publishedAt;

      const issueData: IssueData = {
        issueDescription: responseIssue.title,
        status: responseIssue.state,
        closedDate: responseIssue.closedAt ? new Date(Date.parse(responseIssue.closedAt)) : undefined,
        latestActivityDate: new Date(Date.parse(latestActivity)),
        linkProject: this.createGitHubUrl(responseRepo.resourcePath),
        linkIssue: this.createGitHubUrl(responseIssue.resourcePath),
      };

      return issueData;
    } catch (err) {
      console.warn(err);
      return undefined;
    }
  }

  private splitOwnerAndName(repo: string): [string, string] | undefined {
    const split = /^@?(.+)\/(.+)$/.exec(repo);
    if (split) {
      return [ split[1], split[2] ];
    } else {
      return undefined;
    }
  }

  private createGitHubUrl(resourcePath: string) {
    return `${GITHUB_URL}${resourcePath}`;
  }

}
