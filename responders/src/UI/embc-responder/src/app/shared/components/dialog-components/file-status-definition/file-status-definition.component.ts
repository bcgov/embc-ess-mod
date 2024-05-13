import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogContent } from 'src/app/core/models/dialog-content.model';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-file-status-definition',
  templateUrl: './file-status-definition.component.html',
  styleUrls: ['./file-status-definition.component.scss'],
  standalone: true,
  imports: [MatButton]
})
export class FileStatusDefinitionComponent {
  @Input() content: string;
  @Output() outputEvent = new EventEmitter<string>();

  close(): void {
    this.outputEvent.emit('close');
  }
}
