import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-information-dialog',
  templateUrl: './information-dialog.component.html',
  styleUrls: ['./information-dialog.component.scss']
})
export class InformationDialogComponent implements OnInit {

  @Output() outputEvent = new EventEmitter<string>();
  @Input() inputEvent: string;

  constructor() { }

  ngOnInit(): void {
  }

  close(): void {
    this.outputEvent.emit('close');
  }

}
