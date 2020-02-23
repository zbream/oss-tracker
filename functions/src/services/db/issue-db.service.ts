import { Issue, IssueState, NEW_ISSUE_PROPS, NewIssue } from '../../models';
import { propertyOf } from '../../utils';
import { sanitizeForDb } from './db-utils';

export class IssueDbService {

  private _collectionRef: FirebaseFirestore.CollectionReference;
  private _stateRef: FirebaseFirestore.DocumentReference;

  constructor(
    firestore: FirebaseFirestore.Firestore,
  ) {
    this._collectionRef = firestore.collection('issues');
    this._stateRef = firestore.doc('state/issues');
  }

  async getIssuesForRefresh(): Promise<FirebaseFirestore.QuerySnapshot> {
    const querySnapshot = await this._collectionRef
      .select(...NEW_ISSUE_PROPS)
      .get();
    return querySnapshot;
  }

  async getIssue(id: string): Promise<FirebaseFirestore.DocumentSnapshot> {
    return await this._collectionRef.doc(id).get();
  }

  async hasIssue(newIssue: NewIssue): Promise<boolean> {
    const querySnapshot = await this._collectionRef
      .where(propertyOf<Issue>('projectName'), '==', newIssue.projectName)
      .where(propertyOf<Issue>('issueNumber'), '==', newIssue.issueNumber)
      .limit(1)
      .get();
    return querySnapshot.size > 0;
  }

  async addIssue(newIssue: Issue): Promise<void> {
    return void await this._collectionRef.add(sanitizeForDb(newIssue));
  }

  async updateIssue(ref: FirebaseFirestore.DocumentReference, newIssue: Issue): Promise<void> {
    return void await ref.update(sanitizeForDb(newIssue));
  }

  async deleteIssue(id: string): Promise<boolean> {
    const issueSnapshot = await this.getIssue(id);
    if (!issueSnapshot.exists) {
      return false;
    }
    await issueSnapshot.ref.delete();
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

  private async _getState(): Promise<IssueState | undefined> {
    const state = (await this._stateRef.get()).data() as IssueState;
    return state;
  }

  private async _updateState(value: Partial<IssueState>): Promise<void> {
    return void await this._stateRef.update(value);
  }

}
