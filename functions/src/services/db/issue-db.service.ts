import { Issue, IssueState, NewIssue } from '../../models';
import { propertyOf, sanitizeForDb } from '../../utils';

export class IssueDbService {

  private _collectionRef: FirebaseFirestore.CollectionReference;
  private _stateRef: FirebaseFirestore.DocumentReference;

  constructor(
    firestore: FirebaseFirestore.Firestore,
  ) {
    this._collectionRef = firestore.collection('issues');
    this._stateRef = firestore.doc('state/issues');
  }

  get issuesRef() {
    return this._collectionRef;
  }

  async addIssue(newIssue: Issue): Promise<void> {
    await this._collectionRef.add(sanitizeForDb(newIssue));
  }

  async hasIssue(newIssue: NewIssue): Promise<boolean> {
    const querySnapshot = await this._collectionRef
      .where(propertyOf<Issue>('projectName'), '==', newIssue.projectName)
      .where(propertyOf<Issue>('issueNumber'), '==', newIssue.issueNumber)
      .limit(1)
      .get();
    return querySnapshot.size > 0;
  }

  async deleteIssue(id: string): Promise<boolean> {
    const issueSnapshot = await this._collectionRef.doc(id).get();
    if (!issueSnapshot.exists) {
      return false;
    }

    await issueSnapshot.ref.delete();
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

  private async getState(): Promise<IssueState | undefined> {
    return (await this._stateRef.get()).data() as IssueState | undefined;
  }

  private async updateState(value: Partial<IssueState>): Promise<void> {
    return await void this._stateRef.update(value);
  }

}
