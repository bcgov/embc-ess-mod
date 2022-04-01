import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-cancel-etransfer-dialog',
  templateUrl: './cancel-etransfer-dialog.component.html',
  styleUrls: ['./cancel-etransfer-dialog.component.scss']
})
export class CancelEtransferDialogComponent implements OnInit {
  @Input() profileData: string;
  @Output() outputEvent = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  close(): void {
    this.outputEvent.emit('close');
  }

  cancel(): void {
    this.outputEvent.emit('cancel');
  }
}
