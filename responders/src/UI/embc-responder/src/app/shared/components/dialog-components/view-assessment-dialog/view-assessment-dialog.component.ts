import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogContent } from 'src/app/core/models/dialog-content.model';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import * as globalConst from '../../../../core/services/global-constants';

@Component({
  selector: 'app-view-assessment-dialog',
  templateUrl: './view-assessment-dialog.component.html',
  styleUrls: ['./view-assessment-dialog.component.scss']
})
export class ViewAssessmentDialogComponent implements OnInit {
  @Input() content: DialogContent;
  @Input() profileData: EvacuationFileModel;
  @Output() outputEvent = new EventEmitter<string>();

  memberColumns: string[] = ['firstName', 'lastName', 'dateOfBirth'];
  petColumns: string[] = ['type', 'quantity'];

  constructor() {}

  ngOnInit(): void {}

  cancel() {
    this.outputEvent.emit('close');
  }

  /**
   * Maps needs assessment api value to UI string
   *
   * @param incomingValue needs assessment value
   * @returns
   */
  mapNeedsValues(incomingValue: boolean | null): string {
    return globalConst.needsOptions.find(
      (ins) => ins.apiValue === incomingValue
    )?.name;
  }
}
