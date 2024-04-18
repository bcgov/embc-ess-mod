import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogContent } from 'src/app/core/model/dialog-content.model';
import { EvacuationFileModel } from 'src/app/core/model/evacuation-file.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-ess-file-dialog',
  templateUrl: './ess-file-dialog.component.html',
  styleUrls: ['./ess-file-dialog.component.scss'],
  standalone: true,
  imports: [MatButtonModule]
})
export class EssFileDialogComponent {
  @Input() essFileData: EvacuationFileModel | string;
  @Input() content: DialogContent;
  @Input() initDialog: boolean;
  @Output() outputEvent = new EventEmitter<string>();

  get essFileDataAsString() {
    return this.essFileData as string;
  }

  get essFileDataAsModel() {
    return this.essFileData as EvacuationFileModel;
  }

  cancel() {
    this.outputEvent.emit('close');
  }

  confirm(): void {
    this.outputEvent.emit('confirm');
  }
}
