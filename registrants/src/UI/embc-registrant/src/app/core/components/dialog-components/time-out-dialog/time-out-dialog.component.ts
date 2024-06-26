import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Idle } from '@ng-idle/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-time-out-dialog',
  templateUrl: './time-out-dialog.component.html',
  styleUrls: ['./time-out-dialog.component.scss'],
  standalone: true,
  imports: [MatButtonModule, DatePipe]
})
export class TimeOutDialogComponent implements OnInit {
  @Input() idle: Idle;
  @Input() initDialog: number;
  @Output() outputEvent = new EventEmitter<string>();
  countdown: number;

  constructor() {}

  ngOnInit(): void {
    this.countdown = this.initDialog;
    this.idle.onIdleEnd.subscribe(() => {
      this.outputEvent.emit('close');
    });
    this.idle.onTimeoutWarning.subscribe((countdown) => {
      this.countdown = countdown;
    });
  }

  close(): void {
    this.outputEvent.emit('close');
  }
}
