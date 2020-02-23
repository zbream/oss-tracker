import * as cors from 'cors';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { Config } from './config';
import { IssuesController, ProjectsController } from './controllers';
import { fbHostingRedirectUrlFix } from './fixes';
import {
  HttpIssueRetrieverService,
  HttpProjectRetrieverService,
  IssueDbService,
  IssueRetrieverService,
  IssueUpdaterService,
  ProjectDbService,
  ProjectRetrieverService,
  ProjectUpdaterService,
} from './services';
// import {
//   MockIssueRetrieverService,
//   MockProjectRetrieverService,
// } from './services/mocks';

// server config
const config = functions.config() as Config;

// initialize firebase admin
admin.initializeApp();
const firestore = admin.firestore();

// declare services
let issueDb: IssueDbService;
let projectDb: ProjectDbService;
let issueRetriever: IssueRetrieverService;
let projectRetriever: ProjectRetrieverService;
let issueUpdater: IssueUpdaterService;
let projectUpdater: ProjectUpdaterService;

// initialize services
issueDb = new IssueDbService(firestore);
projectDb = new ProjectDbService(firestore);
issueRetriever = new HttpIssueRetrieverService(config.github?.token || '');
projectRetriever = new HttpProjectRetrieverService();
// issueRetriever = new MockIssueRetrieverService();
// projectRetriever = new MockProjectRetrieverService();
issueUpdater = new IssueUpdaterService(issueDb, issueRetriever);
projectUpdater = new ProjectUpdaterService(projectDb, projectRetriever);

// initialize controllers
const issuesController = new IssuesController(issueDb, issueRetriever, issueUpdater);
const projectsController = new ProjectsController(projectDb, projectRetriever, projectUpdater);

// initialize API
const app = express();
app.use(cors({ origin: true }));
app.use(fbHostingRedirectUrlFix('api'));

app.get('/', (req, res) => void res.status(200).json({ message: 'PING' }));
app.use('/issues', issuesController.handler);
app.use('/projects', projectsController.handler);

export const api = functions.https.onRequest(app);
