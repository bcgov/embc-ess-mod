import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogContent } from 'src/app/core/models/dialog-content.model';

@Component({
  selector: 'app-file-status-definition',
  templateUrl: './file-status-definition.component.html',
  styleUrls: ['./file-status-definition.component.scss']
})
export class FileStatusDefinitionComponent implements OnInit {
  @Input() content: string;
  @Output() outputEvent = new EventEmitter<string>();
  constructor() {}

  ngOnInit(): void {}

  close(): void {
    this.outputEvent.emit('close');
  }
}
