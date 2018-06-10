import { Component, Input, OnInit } from '@angular/core';

import { Issue } from '../../../../models/issue';

@Component({
  selector: 'oss-issues-table',
  templateUrl: './issues-table.component.html',
  styleUrls: ['./issues-table.component.scss'],
})
export class IssuesTableComponent implements OnInit {

  _defaultSort = [{
    prop: 'latestActivityDate',
    dir: 'desc',
  }];

  @Input()
  issues?: Issue[];

  constructor() { }

  ngOnInit() { }

  _onActivate(event: any) {
    if (event.type === 'click') {
      const issue: Issue = event.row;
      window.open(issue.links.issue, '_blank');
    }
  }

  _rowClass(row: Issue) {
    switch (row.status) {
      case 'CLOSED':
        return 'issues-table__row issues-table__row--closed';
      case 'OPEN':
        return 'issues-table__row issues-table__row--open';
      default:
        return 'issues-table__row';
    }
  }

  _comparatorIssueColumn(propA: any, propB: any, issueA: Issue, issueB: Issue) {
    // sort project A-Z, then issue Hi-Lo
    const pA = issueA.project.toUpperCase();
    const pB = issueB.project.toUpperCase();
    if (pA < pB) {
      return -1;
    }
    if (pA > pB) {
      return 1;
    }
    const iA = issueA.issue;
    const iB = issueB.issue;
    if (iA < iB) {
      return 1;
    }
    if (iA > iB) {
      return -1;
    }
    return 0;
  }

}
