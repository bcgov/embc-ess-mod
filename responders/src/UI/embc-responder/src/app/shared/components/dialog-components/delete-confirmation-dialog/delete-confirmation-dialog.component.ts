import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrls: ['./delete-confirmation-dialog.component.scss']
})
export class DeleteConfirmationDialogComponent implements OnInit {

  @Output() outputEvent = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  confirmDeleteChange($event: MatCheckboxChange): void {
    console.log($event);
    this.outputEvent.emit($event.checked);
  }

}
