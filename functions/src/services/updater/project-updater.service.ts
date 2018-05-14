import { NewProject, NEW_PROJECT_PROPS, Project } from '../../models/project';
import { sanitizeForDb } from '../../utils';

import { ProjectDbService } from '../db/project-db.service';
import { ProjectRetrieverService } from '../retriever/interfaces';

export class ProjectUpdaterService {

  constructor(
    private projectDb: ProjectDbService,
    private projectRetriever: ProjectRetrieverService,
  ) {}

  async updateAll(): Promise<void> {
    try {
      await this.projectDb.setRefreshInProgress(true);

      const projectsSnapshot = await this.projectDb.projectsRef
        .select(...NEW_PROJECT_PROPS)
        .get();

      const timestamp = new Date(Date.now());
      await this.projectDb.setRefreshed(timestamp);

      const updates = projectsSnapshot.docs.map(projectSnapshot => this.updateProject(projectSnapshot, timestamp));
      await Promise.all(updates);
    } finally {
      await this.projectDb.setRefreshInProgress(false);
    }
  }

  async updateOne(id: string): Promise<boolean> {
    const projectSnapshot = await this.projectDb.projectsRef.doc(id).get();
    if (!projectSnapshot.exists) {
      return false;
    }

    const timestamp = new Date(Date.now());
    await this.updateProject(projectSnapshot, timestamp);
    return true;
  }

  private async updateProject(projectSnapshot: FirebaseFirestore.DocumentSnapshot, timestamp: Date): Promise<void> {
    // assume the snapshot contains data (the Document exists)
    const project = projectSnapshot.data() as NewProject;
    const updatedProjectData = await this.projectRetriever.retrieveProject(project);
    if (updatedProjectData !== undefined) {
      const updatedProject: Project = {
        refreshed: timestamp,
        ...project,
        data: updatedProjectData,
      };
      await projectSnapshot.ref.update(sanitizeForDb(updatedProject));
    }
  }

}
