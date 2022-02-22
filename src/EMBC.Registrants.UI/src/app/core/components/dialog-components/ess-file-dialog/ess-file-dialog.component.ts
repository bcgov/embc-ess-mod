import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogContent } from 'src/app/core/model/dialog-content.model';
import { EvacuationFileModel } from 'src/app/core/model/evacuation-file.model';

@Component({
  selector: 'app-ess-file-dialog',
  templateUrl: './ess-file-dialog.component.html',
  styleUrls: ['./ess-file-dialog.component.scss']
})
export class EssFileDialogComponent implements OnInit {
  @Input() essFileData: EvacuationFileModel | string;
  @Input() content: DialogContent;
  @Input() initDialog: boolean;
  @Output() outputEvent = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  cancel() {
    this.outputEvent.emit('close');
  }

  confirm(): void {
    this.outputEvent.emit('confirm');
  }
}
