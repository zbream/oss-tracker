import { NewProject, Project } from '../../models';
import { ProjectDbService } from '../db/project-db.service';
import { ProjectRetrieverService } from '../retriever/interfaces';

export class ProjectUpdaterService {

  constructor(
    private _projectDb: ProjectDbService,
    private _projectRetriever: ProjectRetrieverService,
  ) {}

  async updateAll(): Promise<void> {
    try {
      await this._projectDb.setRefreshInProgress(true);

      const projectsSnapshot = await this._projectDb.getProjectsForRefresh();

      const timestamp = new Date(Date.now());
      await this._projectDb.setRefreshed(timestamp);

      const updates = projectsSnapshot.docs.map(projectSnapshot => this.updateProject(projectSnapshot, timestamp));
      await Promise.all(updates);
    } finally {
      await this._projectDb.setRefreshInProgress(false);
    }
  }

  async updateOne(id: string): Promise<boolean> {
    const projectSnapshot = await this._projectDb.getProject(id);
    if (!projectSnapshot.exists) {
      return false;
    }

    const timestamp = new Date(Date.now());
    await this.updateProject(projectSnapshot, timestamp);
    return true;
  }

  private async updateProject(projectSnapshot: FirebaseFirestore.DocumentSnapshot, timestamp: Date): Promise<void> {
    try {
      // assume the snapshot contains data (the Document exists)
      const project = projectSnapshot.data() as NewProject;
      const updatedProjectData = await this._projectRetriever.retrieveProject(project);
      if (updatedProjectData) {
        const updatedProject: Project = {
          refreshed: timestamp,
          ...project,
          data: updatedProjectData,
        };
        await this._projectDb.updateProject(projectSnapshot.ref, updatedProject);
      }
    } catch (err) {
      console.error(err);
    }
  }

}
