import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-information-dialog',
  templateUrl: './information-dialog-exit-wizard.component.html',
  styleUrls: ['./information-dialog-exit-wizard.component.scss']
})
export class InformationDialogExitWizardComponent implements OnInit {
  @Output() outputEvent = new EventEmitter<string>();
  @Input() inputEvent: any;

  constructor() {}

  ngOnInit(): void {}

  close(): void {
    this.outputEvent.emit('close');
  }

  exit(): void {
    this.outputEvent.emit('exit');
  }
}
