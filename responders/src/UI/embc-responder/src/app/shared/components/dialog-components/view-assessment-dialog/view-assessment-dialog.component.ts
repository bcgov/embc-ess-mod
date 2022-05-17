import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogContent } from 'src/app/core/models/dialog-content.model';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
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

  constructor(public evacueeSessionService: EvacueeSessionService) {}

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

  mapDietaryValue(): string {
    if (!this.profileData?.needsAssessment?.haveSpecialDiet) {
      return 'No';
    } else if (this.profileData?.needsAssessment?.specialDietDetails === null) {
      return 'Yes';
    } else {
      return 'Yes - ' + this.profileData?.needsAssessment?.specialDietDetails;
    }
  }
}
