import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogContent } from 'src/app/core/models/dialog-content.model';

@Component({
  selector: 'app-yes-no-dialog',
  templateUrl: './yes-no-dialog.component.html',
  styleUrls: ['./yes-no-dialog.component.scss']
})
export class YesNoDialogComponent {
  @Input() content: DialogContent;

  @Output() outputEvent = new EventEmitter<string>();

  cancel(): void {
    this.outputEvent.emit('close');
  }

  confirm(): void {
    this.outputEvent.emit('confirm');
  }
}
