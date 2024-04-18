import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogContent } from 'src/app/core/model/dialog-content.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-information-dialog',
  templateUrl: './information-dialog.component.html',
  styleUrls: ['./information-dialog.component.scss'],
  standalone: true,
  imports: [MatButtonModule]
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
}
