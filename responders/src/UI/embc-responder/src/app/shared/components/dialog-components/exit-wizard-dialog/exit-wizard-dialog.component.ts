import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-exit-wizard-dialog',
  templateUrl: './exit-wizard-dialog.component.html',
  styleUrls: ['./exit-wizard-dialog.component.scss']
})
export class ExitWizardDialogComponent {
  @Output() outputEvent = new EventEmitter<string>();

  cancel(): void {
    this.outputEvent.emit('close');
  }

  exit(): void {
    this.outputEvent.emit('exit');
  }
}
