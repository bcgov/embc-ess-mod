import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-status-definition-dialog',
  templateUrl: './status-definition-dialog.component.html',
  styleUrls: ['./status-definition-dialog.component.scss'],
  standalone: true,
  imports: [MatButton]
})
export class StatusDefinitionDialogComponent {
  @Output() outputEvent = new EventEmitter<string>();
  constructor() {}

  close(): void {
    this.outputEvent.emit('close');
  }
}
