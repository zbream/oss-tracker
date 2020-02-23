import { Request, Response, Router } from 'express';

import { Issue, NewIssue } from '../models';
import { IssueDbService, IssueRetrieverService, IssueUpdaterService } from '../services';
import { BaseController } from './base';

export class IssuesController extends BaseController {

  readonly handler: Router;

  constructor(
    private _issueDb: IssueDbService,
    private _issueRetriever: IssueRetrieverService,
    private _issueUpdater: IssueUpdaterService,
  ) {
    super();

    const router = Router();
    router.post('/add', this._handleAdd.bind(this));
    router.post('/info', this._handleInfo.bind(this));
    router.put('/refresh', this._handleRefresh.bind(this));
    router.delete('/delete/:id', this._handleDelete.bind(this));

    this.handler = router;
  }

  private async _handleAdd(req: Request, res: Response): Promise<void> {
    try {
      const newIssue = this._parseNewIssue(req.body);
      if (!newIssue) {
        return this._resFailClient(res, 'Failed to parse issue from client.');
      }

      const alreadyExists = await this._issueDb.hasIssue(newIssue);
      if (alreadyExists) {
        return this._resFailClient(res, 'The issue already exists in the database.');
      }

      const issueData = await this._issueRetriever.retrieveIssue(newIssue);
      if (!issueData) {
        return this._resFailClient(res, 'Failed to find repo or issue.');
      }

      const issue: Issue = {
        refreshed: new Date(Date.now()),
        ...newIssue,
        data: issueData,
      };
      await this._issueDb.addIssue(issue);

      return this._resSuccess(res, 'Issue added successfully.');
    } catch (err) {
      console.error(err);
      return this._resFailServer(res, 'Unknown failure.');
    }
  }

  private async _handleInfo(req: Request, res: Response): Promise<void> {
    try {
      const newIssue = this._parseNewIssue(req.body);
      if (!newIssue) {
        return this._resFailClient(res, 'Failed to parse issue from client.');
      }

      const issueData = await this._issueRetriever.retrieveIssue(newIssue);
      if (!issueData) {
        return this._resFailClient(res, 'Failed to find repo or issue.');
      }

      const issue: Issue = {
        refreshed: new Date(Date.now()),
        ...newIssue,
        data: issueData,
      };

      return this._resSuccess(res, issue);
    } catch (err) {
      console.error(err);
      return this._resFailServer(res, 'Unknown failure.');
    }
  }

  private async _handleRefresh(req: Request, res: Response): Promise<void> {
    try {
      const refreshInProgress = await this._issueDb.getRefreshInProgress();
      if (refreshInProgress) {
        return this._resSuccess(res, 'A refresh is in progress.');
      }

      await this._issueUpdater.updateAll();
      return this._resSuccess(res, 'Issues refreshed.');
    } catch (err) {
      console.error(err);
      return this._resFailServer(res, 'Unknown failure.');
    }
  }

  private async _handleDelete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.query.id as string;
      const deleted = await this._issueDb.deleteIssue(id);
      if (deleted) {
        return this._resSuccess(res, 'Issue deleted successfully.');
      } else {
        return this._resFailClient(res, 'Issue does not exist in the database.');
      }
    } catch (err) {
      console.error(err);
      return this._resFailServer(res, 'Unknown failure.');
    }
  }

  private _parseNewIssue(body: any): NewIssue | undefined {
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
