import { NewProject, Project, ProjectState } from '../../models';
import { propertyOf, sanitizeForDb } from '../../utils';

export class ProjectDbService {

  private _collectionRef: FirebaseFirestore.CollectionReference;
  private _stateRef: FirebaseFirestore.DocumentReference;

  constructor(
    firestore: FirebaseFirestore.Firestore,
  ) {
    this._collectionRef = firestore.collection('projects');
    this._stateRef = firestore.doc('state/projects');
  }

  get projectsRef() {
    return this._collectionRef;
  }

  async addProject(newProject: Project): Promise<void> {
    await this._collectionRef.add(sanitizeForDb(newProject));
  }

  async hasProject(newProject: NewProject): Promise<boolean> {
    const querySnapshot = await this._collectionRef
      .where(propertyOf<Project>('name'), '==', newProject.name)
      .limit(1)
      .get();
    return querySnapshot.size > 0;
  }

  async deleteProject(id: string): Promise<boolean> {
    const projectSnapshot = await this._collectionRef.doc(id).get();
    if (!projectSnapshot.exists) {
      return false;
    }

    await projectSnapshot.ref.delete();
    return true;
  }

  async getRefreshInProgress(): Promise<boolean> {
    const state = await this.getState();
    return state ? state.refreshInProgress : false;
  }

  async setRefreshInProgress(value: boolean): Promise<void> {
    return await this.updateState({ refreshInProgress: value });
  }

  async getRefreshed(): Promise<Date | undefined> {
    const state = await this.getState();
    return state ? state.refreshed : undefined;
  }

  async setRefreshed(value: Date): Promise<void> {
    return await this.updateState({ refreshed: value });
  }

  private async getState(): Promise<ProjectState | undefined> {
    return (await this._stateRef.get()).data() as ProjectState | undefined;
  }

  private async updateState(value: Partial<ProjectState>): Promise<void> {
    return await void this._stateRef.update(value);
  }

}
