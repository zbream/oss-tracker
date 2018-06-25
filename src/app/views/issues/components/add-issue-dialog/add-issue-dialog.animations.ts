import { animate, state, style, transition, trigger } from '@angular/animations';

export const ADD_ISSUE_DIALOG_ANIMATIONS = [
  trigger('grow', [
    state('*', style({ height: '*' })),
    state('void', style({ height: 0 })),
    transition('void => *', animate(100)),
    transition('* => void', animate(100)),
  ]),
];
