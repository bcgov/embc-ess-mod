import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-status-definition-dialog',
  templateUrl: './status-definition-dialog.component.html',
  styleUrls: ['./status-definition-dialog.component.scss']
})
export class StatusDefinitionDialogComponent implements OnInit {
  @Output() outputEvent = new EventEmitter<string>();
  constructor() {}

  ngOnInit(): void {}

  close(): void {
    this.outputEvent.emit('close');
  }
}
