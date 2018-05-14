import { Request, Response, Router } from 'express';

import { Issue, NewIssue } from '../models';
import { IssueDbService, IssueRetrieverService, IssueUpdaterService } from '../services';
import { BaseController } from './base';

export class IssuesController extends BaseController {

  readonly handler: Router;

  constructor(
    private issueDb: IssueDbService,
    private issueRetriever: IssueRetrieverService,
    private issueUpdater: IssueUpdaterService,
  ) {
    super();

    const router = Router();
    router.post('/add', this.handleAdd.bind(this));
    router.post('/info', this.handleInfo.bind(this));
    router.put('/refresh', this.handleRefresh.bind(this));
    router.delete('/delete/:id', this.handleDelete.bind(this));

    this.handler = router;
  }

  private async handleAdd(req: Request, res: Response): Promise<void> {
    try {
      const newIssue = this.parseNewIssue(req.body);
      if (!newIssue) {
        return this.resFailClient(res, 'Failed to parse issue from client.');
      }

      const alreadyExists = await this.issueDb.hasIssue(newIssue);
      if (alreadyExists) {
        return this.resFailClient(res, 'The issue already exists in the database.');
      }

      const issueData = await this.issueRetriever.retrieveIssue(newIssue);
      if (!issueData) {
        return this.resFailClient(res, 'Failed to find repo or issue.');
      }

      const issue: Issue = {
        refreshed: new Date(Date.now()),
        ...newIssue,
        data: issueData,
      };
      await this.issueDb.addIssue(issue);

      return this.resSuccess(res, 'Issue added successfully.');
    } catch (err) {
      console.error(err);
      return this.resFailServer(res, 'Unknown failure.');
    }
  }

  private async handleInfo(req: Request, res: Response): Promise<void> {
    try {
      const newIssue = this.parseNewIssue(req.body);
      if (!newIssue) {
        return this.resFailClient(res, 'Failed to parse issue from client.');
      }

      const issueData = await this.issueRetriever.retrieveIssue(newIssue);
      if (!issueData) {
        return this.resFailClient(res, 'Failed to find repo or issue.');
      }

      const issue: Issue = {
        refreshed: new Date(Date.now()),
        ...newIssue,
        data: issueData,
      };

      return this.resSuccess(res, issue);
    } catch (err) {
      console.error(err);
      return this.resFailServer(res, 'Unknown failure.');
    }
  }

  private async handleRefresh(req: Request, res: Response): Promise<void> {
    try {
      const refreshInProgress = await this.issueDb.getRefreshInProgress();
      if (refreshInProgress) {
        return this.resSuccess(res, 'A refresh is in progress.');
      }

      await this.issueUpdater.updateAll();
      return this.resSuccess(res, 'Issues refreshed.');
    } catch (err) {
      console.error(err);
      return this.resFailServer(res, 'Unknown failure.');
    }
  }

  private async handleDelete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.query.id as string;
      const deleted = await this.issueDb.deleteIssue(id);
      if (deleted) {
        return this.resSuccess(res, 'Issue deleted successfully.');
      } else {
        return this.resFailClient(res, 'Issue does not exist in the database.');
      }
    } catch (err) {
      console.error(err);
      return this.resFailServer(res, 'Unknown failure.');
    }
  }

  private parseNewIssue(body: any): NewIssue | undefined {
    try {
      // parse
      const newIssue: NewIssue = {
        projectName: body.projectName,
        issueNumber: +body.issueNumber,
      };

      // validate
      if (
        typeof newIssue.projectName !== 'string' ||
        isNaN(newIssue.issueNumber)
      ) {
        return undefined;
      }

      return newIssue;
    } catch {
      return undefined;
    }
  }

}
