import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatLegacyCheckboxChange as MatCheckboxChange } from '@angular/material/legacy-checkbox';

@Component({
  selector: 'app-delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrls: ['./delete-confirmation-dialog.component.scss']
})
export class DeleteConfirmationDialogComponent {
  @Output() outputEvent = new EventEmitter<string>();
  isConfirmed = false;
  showError = false;

  constructor() {}

  confirmDeleteChange($event: MatCheckboxChange): void {
    this.isConfirmed = $event.checked;
    if (this.isConfirmed) {
      this.showError = !this.isConfirmed;
    }
  }

  cancel(): void {
    this.outputEvent.emit('close');
  }

  delete(): void {
    if (this.isConfirmed) {
      this.outputEvent.emit('delete');
    } else {
      this.showError = !this.isConfirmed;
    }
  }
}
