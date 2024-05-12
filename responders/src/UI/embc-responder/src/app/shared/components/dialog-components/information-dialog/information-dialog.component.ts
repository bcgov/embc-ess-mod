import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogContent } from 'src/app/core/models/dialog-content.model';
import { MatButton } from '@angular/material/button';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-information-dialog',
    templateUrl: './information-dialog.component.html',
    styleUrls: ['./information-dialog.component.scss'],
    standalone: true,
    imports: [NgIf, MatButton]
})
export class InformationDialogComponent {
  @Input() content: DialogContent;
  @Output() outputEvent = new EventEmitter<string>();

  cancel(): void {
    this.outputEvent.emit('cancel');
  }

  confirm(): void {
    this.outputEvent.emit('confirm');
  }

  exit(): void {
    this.outputEvent.emit('exit');
  }
}
