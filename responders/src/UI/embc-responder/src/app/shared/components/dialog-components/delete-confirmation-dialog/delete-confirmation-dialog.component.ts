import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrls: ['./delete-confirmation-dialog.component.scss']
})
export class DeleteConfirmationDialogComponent implements OnInit {

  @Output() outputEvent = new EventEmitter<string>();
  isConfirmed = false;

  constructor() { }

  ngOnInit(): void {
  }

  confirmDeleteChange($event: MatCheckboxChange): void {
    this.isConfirmed = $event.checked; 
  }

  cancel(): void {
    this.outputEvent.emit('close');
  }

  delete(): void {
    this.outputEvent.emit('delete');
  }

}
