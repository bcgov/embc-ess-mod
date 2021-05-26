import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-delete-household-dialog',
  templateUrl: './delete-household-dialog.component.html',
  styleUrls: ['./delete-household-dialog.component.scss']
})
export class DeleteHouseholdDialogComponent {
  @Output() outputEvent = new EventEmitter<string>();
  isConfirmed = false;
  showError = false;
  constructor() { }

  cancel(): void {
    this.outputEvent.emit('close');
  }

  delete(): void {
    this.outputEvent.emit('delete');
  }
}
