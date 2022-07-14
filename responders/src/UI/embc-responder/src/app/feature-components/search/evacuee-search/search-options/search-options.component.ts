import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TaskWorkflow } from 'src/app/core/api/models';
import { SelectedPathType } from 'src/app/core/models/appBase.model';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { ComputeRulesService } from 'src/app/core/services/computeRules.service';
import { UserService } from 'src/app/core/services/user.service';
import {
  ActionPermission,
  ClaimType
} from 'src/app/core/services/authorization.service';

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
  readonly selectedPathType = SelectedPathType;
  noSelectionFlag = false;

  constructor(
    private appBaseService: AppBaseService,
    private evacueeSessionService: EvacueeSessionService,
    private computeState: ComputeRulesService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.workflows = this.appBaseService?.appModel?.selectedEssTask?.workflows;
    const enabledWorkflows = this.workflows?.filter((w) => w.enabled);
    if (
      enabledWorkflows &&
      enabledWorkflows.length === 1 &&
      enabledWorkflows[0].name === 'paper-data-entry'
    ) {
      this.setSelection(SelectedPathType.paperBased);
    }
  }

  setSelection(pathway: string) {
    this.selectedPathway = SelectedPathType[pathway];
    this.noSelectionFlag = false;
  }

  isEnabled(name: string): boolean {
    if (name === 'remote-extensions') {
      return (
        !this.workflows?.find((flow) => flow.name === name)?.enabled ||
        !this.hasPermission('canSignIntoRemoteExtensions')
      );
    }

    return !this.workflows?.find((flow) => flow.name === name)?.enabled;
  }

  next() {
    if (this.selectedPathway === undefined) {
      this.noSelectionFlag = true;
    } else {
      this.appBaseService.appModel = {
        selectedUserPathway: this.selectedPathway
      };
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

  /**
   * Checks if the user can permission to perform given action
   *
   * @param action user action
   * @returns true/false
   */
  public hasPermission(action: string): boolean {
    return this.userService.hasClaim(
      ClaimType.action,
      ActionPermission[action]
    );
  }
}
