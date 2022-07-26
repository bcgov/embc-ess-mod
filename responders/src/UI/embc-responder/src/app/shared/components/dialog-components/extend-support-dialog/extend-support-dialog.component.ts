import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-extend-supports-dialog',
  templateUrl: './extend-support-dialog.component.html',
  styleUrls: ['./extend-support-dialog.component.scss']
})
export class ExtendSupportsDialogComponent implements OnInit {
  @Output() outputEvent = new EventEmitter<string>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {}

  confirm(): void {
    this.outputEvent.emit('confirm');
  }

  cancel(): void {
    this.outputEvent.emit('cancel');
  }
}
