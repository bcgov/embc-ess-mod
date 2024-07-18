import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogContent } from 'src/app/core/models/dialog-content.model';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import * as globalConst from '../../../../core/services/global-constants';
import { LoadEvacueeListService } from 'src/app/core/services/load-evacuee-list.service';
import { MaskEvacuatedAddressPipe } from '../../../pipes/maskEvacuatedAddress.pipe';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow
} from '@angular/material/table';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-assessment-dialog',
  templateUrl: './view-assessment-dialog.component.html',
  styleUrls: ['./view-assessment-dialog.component.scss'],
  standalone: true,
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    DatePipe,
    MaskEvacuatedAddressPipe
  ]
})
export class ViewAssessmentDialogComponent {
  @Input() content: DialogContent;
  @Input() profileData: EvacuationFileModel;
  @Output() outputEvent = new EventEmitter<string>();

  memberColumns: string[] = ['firstName', 'lastName', 'dateOfBirth', 'contact'];
  petColumns: string[] = ['type', 'quantity'];
  noAssistanceRequiredMessage = globalConst.noAssistanceRequired;
  constructor(
    public evacueeSessionService: EvacueeSessionService,
    private loadEvacueeListService: LoadEvacueeListService
  ) {}

  cancel() {
    this.outputEvent.emit('close');
  }

  /**
   * Maps insurance api value to UI string
   *
   * @param incomingValue needs assessment value
   * @returns
   */
  mapInsuranceValues(incomingValue: string | null): string {
    return globalConst.insuranceOptions.find((ins) => ins.value === incomingValue)?.name;
  }

  public getIdentifiedNeeds(): string[] {
    return Array.from(this.evacueeSessionService?.currentNeedsAssessment?.needs ?? []).map(
      (need) => this.loadEvacueeListService?.getIdentifiedNeeds()?.find((value) => value.value === need)?.description
    );
  }
}
