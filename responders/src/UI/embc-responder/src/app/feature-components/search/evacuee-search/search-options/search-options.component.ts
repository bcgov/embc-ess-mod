import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TaskWorkflow } from 'src/app/core/api/models';
import { SelectedPathType } from 'src/app/core/models/appBase.model';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
//import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { ComputeRulesService } from 'src/app/core/services/computeRules.service';
import { EtransferFeaturesService } from 'src/app/core/services/helper/etransferfeatures.service';

@Component({
  selector: 'app-search-options',
  templateUrl: './search-options.component.html',
  styleUrls: ['./search-options.component.scss']
})
export class SearchOptionsComponent implements OnInit {
  @Output() showDataEntryComponent = new EventEmitter<boolean>();
  @Output() showIDPhotoComponent = new EventEmitter<boolean>();

  selectedPathway: SelectedPathType;
  workflows: Array<TaskWorkflow> = new Array<TaskWorkflow>();
  readonly SelectedPathType = SelectedPathType;
  noSelectionFlag = false;

  constructor(
    //private appBaseService: AppBaseService,
    private evacueeSessionService: EvacueeSessionService,
    private featuresService: EtransferFeaturesService,
    private computeState: ComputeRulesService
  ) {}

  ngOnInit(): void {
    console.log(this.featuresService?.appModel?.selectedEssTask);
    this.workflows = this.featuresService?.appModel?.selectedEssTask?.workflows;
  }

  setSelection(pathway: string) {
    this.selectedPathway = SelectedPathType[pathway];
    this.noSelectionFlag = false;
  }

  isEnabled(name: string): boolean {
    return !this.workflows?.find((flow) => flow.name === name)?.enabled;
  }

  next() {
    if (this.selectedPathway === undefined) {
      this.noSelectionFlag = true;
    } else {
      this.featuresService.setAppModel({
        selectedUserPathway: this.selectedPathway
      });
      if (this.selectedPathway === SelectedPathType.paperBased) {
        this.evacueeSessionService.isPaperBased = true;
      } else {
        this.evacueeSessionService.isPaperBased = false;
      }
      this.computeState.triggerEvent();
      this.showDataEntryComponent.emit(false);
      this.showIDPhotoComponent.emit(true);
    }
  }
}
