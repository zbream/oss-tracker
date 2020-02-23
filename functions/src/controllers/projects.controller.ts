import { Request, Response, Router } from 'express';

import { NewProject, Project } from '../models';
import { ProjectDbService, ProjectRetrieverService, ProjectUpdaterService } from '../services';
import { BaseController } from './base';

export class ProjectsController extends BaseController {

  readonly handler: Router;

  constructor(
    private _projectDb: ProjectDbService,
    private _projectRetriever: ProjectRetrieverService,
    private _projectUpdater: ProjectUpdaterService,
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
      const newProject = this._parseNewProject(req.body);
      if (!newProject) {
        return this._resFailClient(res, 'Failed to parse project from client.');
      }

      const alreadyExists = await this._projectDb.hasProject(newProject);
      if (alreadyExists) {
        return this._resFailClient(res, 'The project already exists in the database.');
      }

      const projectData = await this._projectRetriever.retrieveProject(newProject);
      if (!projectData) {
        return this._resFailClient(res, 'Failed to find project.');
      }

      const project: Project = {
        refreshed: new Date(Date.now()),
        ...newProject,
        data: projectData,
      };
      await this._projectDb.addProject(project);

      return this._resSuccess(res, 'Project added successfully.');
    } catch (err) {
      console.error(err);
      return this._resFailServer(res, 'Unknown failure.');
    }
  }

  private async _handleInfo(req: Request, res: Response): Promise<void> {
    try {
      const newProject = this._parseNewProject(req.body);
      if (!newProject) {
        return this._resFailClient(res, 'Failed to parse project from client.');
      }

      const projectData = await this._projectRetriever.retrieveProject(newProject);
      if (!projectData) {
        return this._resFailClient(res, 'Failed to find project.');
      }

      const project: Project = {
        refreshed: new Date(Date.now()),
        ...newProject,
        data: projectData,
      };

      return this._resSuccess(res, project);
    } catch (err) {
      console.error(err);
      return this._resFailServer(res, 'Unknown failure.');
    }
  }

  private async _handleRefresh(req: Request, res: Response): Promise<void> {
    try {
      const refreshInProgress = await this._projectDb.getRefreshInProgress();
      if (refreshInProgress) {
        return this._resSuccess(res, 'A refresh is in progress.');
      }

      await this._projectUpdater.updateAll();
      return this._resSuccess(res, 'Projects refreshed.');
    } catch (err) {
      console.error(err);
      return this._resFailServer(res, 'Unknown failure.');
    }
  }

  private async _handleDelete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.query.id as string;
      const deleted = await this._projectDb.deleteProject(id);
      if (deleted) {
        return this._resSuccess(res, 'Project deleted successfully.');
      } else {
        return this._resFailClient(res, 'Project does not exist in the database.');
      }
    } catch (err) {
      console.error(err);
      return this._resFailServer(res, 'Unknown failure.');
    }
  }

  private _parseNewProject(body: any): NewProject | undefined {
    try {
      // parse
      const newProject: NewProject = {
        name: body.name,
        linkUrl: body.linkUrl,
        linkChangelog: body.linkChangelog,
        nextTag: body.nextTag,
      };

      // validate
      if (
        typeof newProject.name !== 'string' ||
        typeof newProject.linkUrl !== 'string' ||
        typeof newProject.linkChangelog !== 'string' ||
        (newProject.nextTag !== undefined && typeof newProject.nextTag !== 'string')
      ) {
        return undefined;
      }

      return newProject;
    } catch {
      return undefined;
    }
  }

}
