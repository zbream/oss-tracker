import { Component, Input, OnInit } from '@angular/core';

import { Project } from '../../../../models/project';

const MIN_DATE = new Date(0);

@Component({
  selector: 'oss-projects-table',
  templateUrl: './projects-table.component.html',
  styleUrls: ['./projects-table.component.scss'],
})
export class ProjectsTableComponent implements OnInit {

  _defaultSort = [{
    prop: 'latest',
    dir: 'desc',
  }];

  @Input()
  projects?: Project[];

  constructor() { }

  ngOnInit() { }

  _onActivate(event: any) {
    if (event.type === 'click') {
      const project: Project = event.row;
      window.open(project.links.changelog, '_blank');
    }
  }

  _rowClass() {
    return 'projects-table__row';
  }

  _comparatorLatestColumn(propA: any, propB: any, projectA: Project, projectB: Project) {
    // sort date Old-New
    const pA = projectA.latest.date;
    const pB = projectB.latest.date;
    if (pA < pB) {
      return -1;
    }
    if (pA > pB) {
      return 1;
    }
    return 0;
  }

  _comparatorNextColumn(propA: any, propB: any, projectA: Project, projectB: Project) {
    // sort date Old-New
    const pA = projectA.next ? projectA.next.date : MIN_DATE;
    const pB = projectB.next ? projectB.next.date : MIN_DATE;
    if (pA < pB) {
      return -1;
    }
    if (pA > pB) {
      return 1;
    }
    return 0;
  }

}
