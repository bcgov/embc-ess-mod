import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-ess-file-exists',
  templateUrl: './ess-file-exists.component.html',
  styleUrls: ['./ess-file-exists.component.scss']
})
export class EssFileExistsComponent {
  @Input() essFile: string;
  @Output() outputEvent = new EventEmitter<string>();

  constructor() {}

  close(): void {
    this.outputEvent.emit('close');
  }
}
