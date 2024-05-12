import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatCheckboxChange, MatCheckbox } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrls: ['./delete-confirmation-dialog.component.scss'],
  standalone: true,
  imports: [MatCheckbox, MatButton]
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
