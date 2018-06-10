import * as express from 'express';
import * as cors from 'cors';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import * as fixes from './fixes';

import { IssuesController, ProjectsController } from './controllers';
import {
  IssueDbService,
  IssueRetrieverService,
  HttpIssueRetrieverService,
  HttpProjectRetrieverService,
  IssueUpdaterService,
  ProjectDbService,
  ProjectRetrieverService,
  ProjectUpdaterService,
} from './services';
import {
  MockIssueRetrieverService,
  MockProjectRetrieverService,
} from './services/mocks';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

// initialize firebase admin
admin.initializeApp();
const firestore = admin.firestore();

// initialize services
const issueDb: IssueDbService = new IssueDbService(firestore);
const issueRetriever: IssueRetrieverService = new HttpIssueRetrieverService();
// const issueRetriever: IssueRetrieverService = new MockIssueRetrieverService();
const issueUpdater: IssueUpdaterService = new IssueUpdaterService(issueDb, issueRetriever);
const projectDb: ProjectDbService = new ProjectDbService(firestore);
const projectRetriever: ProjectRetrieverService = new HttpProjectRetrieverService();
// const projectRetriever: ProjectRetrieverService = new MockProjectRetrieverService();
const projectUpdater: ProjectUpdaterService = new ProjectUpdaterService(projectDb, projectRetriever);

// initialize controllers
const issuesController = new IssuesController(issueDb, issueRetriever, issueUpdater);
const projectsController = new ProjectsController(projectDb, projectRetriever, projectUpdater);

// initialize API
const app = express();
app.use(cors({ origin: true }));
app.use(fixes.fbHostingRedirectUrlFix('api'));
app.get('/', (req, res) => void res.status(200).json({ message: 'API works!' }));
app.use('/issues', issuesController.handler);
app.use('/projects', projectsController.handler);

export const apiDev = functions.https.onRequest(app);

export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});
