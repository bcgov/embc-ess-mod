import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-yes-no-dialog',
  templateUrl: './yes-no-dialog.component.html',
  styleUrls: ['./yes-no-dialog.component.scss']
})
export class YesNoDialogComponent {

  @Input() inputEvent: string;
  @Input() inputEvent2: string;
  @Input() yesButtonText: string;
  @Input() noButtonText: string;
  
  @Output() outputEvent = new EventEmitter<string>();

  cancel(): void {
    this.outputEvent.emit('close');
  }

  confirm(): void {
    this.outputEvent.emit('confirm');
  }
}
