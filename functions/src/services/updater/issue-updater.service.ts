import { Issue, NewIssue, NEW_ISSUE_PROPS } from '../../models';
import { sanitizeForDb } from '../../utils';

import { IssueDbService } from '../db/issue-db.service';
import { IssueRetrieverService } from '../retriever/interfaces';

export class IssueUpdaterService {

  constructor(
    private issueDb: IssueDbService,
    private issueRetriever: IssueRetrieverService,
  ) {}

  async updateAll(): Promise<void> {
    try {
      await this.issueDb.setRefreshInProgress(true);

      const issuesSnapshot = await this.issueDb.issuesRef
        .select(...NEW_ISSUE_PROPS)
        .get();

      const timestamp = new Date(Date.now());
      await this.issueDb.setRefreshed(timestamp);

      const updates = issuesSnapshot.docs.map(issueSnapshot => this.updateIssue(issueSnapshot, timestamp));
      await Promise.all(updates);
    } finally {
      await this.issueDb.setRefreshInProgress(false);
    }
  }

  async updateOne(id: string): Promise<boolean> {
    const issueSnapshot = await this.issueDb.issuesRef.doc(id).get();
    if (!issueSnapshot.exists) {
      return false;
    }

    const timestamp = new Date(Date.now());
    await this.updateIssue(issueSnapshot, timestamp);
    return true;
  }

  private async updateIssue(issueSnapshot: FirebaseFirestore.DocumentSnapshot, timestamp: Date): Promise<void> {
    try {
      // assume the snapshot contains data (the Document exists)
      const issue = issueSnapshot.data() as NewIssue;
      const updatedIssueData = await this.issueRetriever.retrieveIssue(issue);
      if (updatedIssueData !== undefined) {
        const updatedIssue: Issue = {
          refreshed: timestamp,
          ...issue,
          data: updatedIssueData,
        };
        await issueSnapshot.ref.update(sanitizeForDb(updatedIssue));
      }
    } catch (err) {
      console.error(err);
    }
  }

}
