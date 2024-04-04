import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogContent } from 'src/app/core/models/dialog-content.model';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import * as globalConst from '../../../../core/services/global-constants';
import { IdentifiedNeed } from 'src/app/core/api/models';

@Component({
  selector: 'app-view-assessment-dialog',
  templateUrl: './view-assessment-dialog.component.html',
  styleUrls: ['./view-assessment-dialog.component.scss']
})
export class ViewAssessmentDialogComponent implements OnInit {
  @Input() content: DialogContent;
  @Input() profileData: EvacuationFileModel;
  @Output() outputEvent = new EventEmitter<string>();
  
  IdentifiedNeed = IdentifiedNeed;

  memberColumns: string[] = ['firstName', 'lastName', 'dateOfBirth'];
  petColumns: string[] = ['type', 'quantity'];

  constructor(public evacueeSessionService: EvacueeSessionService) {}

  ngOnInit(): void {}

  cancel() {
    this.outputEvent.emit('close');
  }

  /**
   * Returns if incoming need exists in ess file needs assessment needs
   *
   * @param incomingNeed needs assessment value
   * @returns boolean
   */
  doesIncludeNeed(incomingNeed: IdentifiedNeed | null): string {
      return this.profileData?.needsAssessment?.needs.includes(incomingNeed) ? 'Yes' : 'No';
  }

  /**
   * Maps insurance api value to UI string
   *
   * @param incomingValue needs assessment value
   * @returns
   */
  mapInsuranceValues(incomingValue: string | null): string {
    return globalConst.insuranceOptions.find(
      (ins) => ins.value === incomingValue
    )?.name;
  }


}
