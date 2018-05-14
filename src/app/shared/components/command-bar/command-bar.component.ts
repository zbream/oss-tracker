import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'oss-command-bar',
  templateUrl: './command-bar.component.html',
  styleUrls: ['./command-bar.component.scss'],
})
export class CommandBarComponent implements OnInit {

  @Input()
  filterFormControl: FormControl = new FormControl('');

  @Input()
  refreshing?: boolean;

  @Output()
  add = new EventEmitter<void>();

  @Output()
  refresh = new EventEmitter<void>();

  constructor() { }

  ngOnInit() { }

  _onClear() {
    this.filterFormControl.reset('');
  }

  _onAdd() {
    this.add.emit();
  }

  _onRefresh() {
    this.refresh.emit();
  }

}
