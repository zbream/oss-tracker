import { Request, Response, Router } from 'express';

import { NewProject, Project } from '../models';
import { ProjectDbService, ProjectRetrieverService, ProjectUpdaterService } from '../services';
import { BaseController } from './base';

export class ProjectsController extends BaseController {

  readonly handler: Router;

  constructor(
    private projectDb: ProjectDbService,
    private projectRetriever: ProjectRetrieverService,
    private projectUpdater: ProjectUpdaterService,
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
      const newProject = this.parseNewProject(req.body);
      if (!newProject) {
        return this.resFailClient(res, 'Failed to parse project from client.');
      }

      const alreadyExists = await this.projectDb.hasProject(newProject);
      if (alreadyExists) {
        return this.resFailClient(res, 'The project already exists in the database.');
      }

      const projectData = await this.projectRetriever.retrieveProject(newProject);
      if (!projectData) {
        return this.resFailClient(res, 'Failed to find project.');
      }

      const project: Project = {
        refreshed: new Date(Date.now()),
        ...newProject,
        data: projectData,
      };
      await this.projectDb.addProject(project);

      return this.resSuccess(res, 'Project added successfully.');
    } catch (err) {
      console.error(err);
      return this.resFailServer(res, 'Unknown failure.');
    }
  }

  private async handleInfo(req: Request, res: Response): Promise<void> {
    try {
      const newProject = this.parseNewProject(req.body);
      if (!newProject) {
        return this.resFailClient(res, 'Failed to parse project from client.');
      }

      const projectData = await this.projectRetriever.retrieveProject(newProject);
      if (!projectData) {
        return this.resFailClient(res, 'Failed to find project.');
      }

      const project: Project = {
        refreshed: new Date(Date.now()),
        ...newProject,
        data: projectData,
      };

      return this.resSuccess(res, project);
    } catch (err) {
      console.error(err);
      return this.resFailServer(res, 'Unknown failure.');
    }
  }

  private async handleRefresh(req: Request, res: Response): Promise<void> {
    try {
      const refreshInProgress = await this.projectDb.getRefreshInProgress();
      if (refreshInProgress) {
        return this.resSuccess(res, 'A refresh is in progress.');
      }

      await this.projectUpdater.updateAll();
      return this.resSuccess(res, 'Projects refreshed.');
    } catch (err) {
      console.error(err);
      return this.resFailServer(res, 'Unknown failure.');
    }
  }

  private async handleDelete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.query.id as string;
      const deleted = await this.projectDb.deleteProject(id);
      if (deleted) {
        return this.resSuccess(res, 'Project deleted successfully.');
      } else {
        return this.resFailClient(res, 'Project does not exist in the database.');
      }
    } catch (err) {
      console.error(err);
      return this.resFailServer(res, 'Unknown failure.');
    }
  }

  private parseNewProject(body: any): NewProject | undefined {
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
