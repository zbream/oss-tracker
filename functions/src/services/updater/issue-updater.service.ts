import { Issue, NewIssue } from '../../models';
import { IssueDbService } from '../db/issue-db.service';
import { IssueRetrieverService } from '../retriever/interfaces';

export class IssueUpdaterService {

  constructor(
    private _issueDb: IssueDbService,
    private _issueRetriever: IssueRetrieverService,
  ) {}

  async updateAll(): Promise<void> {
    try {
      await this._issueDb.setRefreshInProgress(true);

      const issuesSnapshot = await this._issueDb.getIssuesForRefresh();

      const timestamp = new Date(Date.now());
      await this._issueDb.setRefreshed(timestamp);

      const updates = issuesSnapshot.docs.map(issueSnapshot => this._updateIssue(issueSnapshot, timestamp));
      await Promise.all(updates);
    } finally {
      await this._issueDb.setRefreshInProgress(false);
    }
  }

  async updateOne(id: string): Promise<boolean> {
    const issueSnapshot = await this._issueDb.getIssue(id);
    if (!issueSnapshot.exists) {
      return false;
    }

    const timestamp = new Date(Date.now());
    await this._updateIssue(issueSnapshot, timestamp);
    return true;
  }

  private async _updateIssue(issueSnapshot: FirebaseFirestore.DocumentSnapshot, timestamp: Date): Promise<void> {
    try {
      // assume the snapshot contains data (the Document exists)
      const issue = issueSnapshot.data() as NewIssue;
      const updatedIssueData = await this._issueRetriever.retrieveIssue(issue);
      if (updatedIssueData) {
        const updatedIssue: Issue = {
          refreshed: timestamp,
          ...issue,
          data: updatedIssueData,
        };
        await this._issueDb.updateIssue(issueSnapshot.ref, updatedIssue);
      }
    } catch (err) {
      console.error(err);
    }
  }

}
