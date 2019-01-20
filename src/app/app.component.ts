import { Component, Inject } from '@angular/core';

import { CONTACT_TOKEN } from './core/contact.token';

@Component({
  selector: 'oss-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  constructor(
    @Inject(CONTACT_TOKEN) public contact: string,
  ) {}

}
