import { NEW_PROJECT_PROPS, NewProject, Project, ProjectState } from '../../models';
import { propertyOf } from '../../utils';
import { sanitizeForDb } from './db-utils';

export class ProjectDbService {

  private _collectionRef: FirebaseFirestore.CollectionReference;
  private _stateRef: FirebaseFirestore.DocumentReference;

  constructor(
    firestore: FirebaseFirestore.Firestore,
  ) {
    this._collectionRef = firestore.collection('projects');
    this._stateRef = firestore.doc('state/projects');
  }

  async getProjectsForRefresh(): Promise<FirebaseFirestore.QuerySnapshot> {
    const querySnapshot = await this._collectionRef
      .select(...NEW_PROJECT_PROPS)
      .get();
    return querySnapshot;
  }

  async getProject(id: string): Promise<FirebaseFirestore.DocumentSnapshot> {
    return await this._collectionRef.doc(id).get();
  }

  async hasProject(newProject: NewProject): Promise<boolean> {
    const querySnapshot = await this._collectionRef
      .where(propertyOf<Project>('name'), '==', newProject.name)
      .limit(1)
      .get();
    return querySnapshot.size > 0;
  }

  async addProject(newProject: Project): Promise<void> {
    return void await this._collectionRef.add(sanitizeForDb(newProject));
  }

  async updateProject(ref: FirebaseFirestore.DocumentReference, newProject: Project): Promise<void> {
    return void await ref.update(sanitizeForDb(newProject));
  }

  async deleteProject(id: string): Promise<boolean> {
    const projectSnapshot = await this.getProject(id);
    if (!projectSnapshot.exists) {
      return false;
    }
    await projectSnapshot.ref.delete();
    return true;
  }

  async getRefreshInProgress(): Promise<boolean> {
    const state = await this._getState();
    return state?.refreshInProgress || false;
  }

  async setRefreshInProgress(value: boolean): Promise<void> {
    return await this._updateState({ refreshInProgress: value });
  }

  async getRefreshed(): Promise<Date | undefined> {
    const state = await this._getState();
    return state?.refreshed;
  }

  async setRefreshed(value: Date): Promise<void> {
    return await this._updateState({ refreshed: value });
  }

  private async _getState(): Promise<ProjectState | undefined> {
    const state = (await this._stateRef.get()).data() as ProjectState;
    return state;
  }

  private async _updateState(state: Partial<ProjectState>): Promise<void> {
    return void await this._stateRef.update(state);
  }

}
