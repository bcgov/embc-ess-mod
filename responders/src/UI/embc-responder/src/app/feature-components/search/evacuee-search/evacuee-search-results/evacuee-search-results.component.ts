import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EvacueeSearchContextModel } from 'src/app/core/models/evacuee-search-context.model';
import { UserService } from 'src/app/core/services/user.service';
import { EvacueeSearchService } from '../evacuee-search.service';
import { EvacueeSearchResultsService } from './evacuee-search-results.service';
import {
  ActionPermission,
  ClaimType
} from 'src/app/core/services/authorization.service';
import { Router } from '@angular/router';
import {
  EvacuationFileSearchResultModel,
  RegistrantProfileSearchResultModel
} from 'src/app/core/models/evacuee-search-results';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import * as globalConst from '../../../../core/services/global-constants';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { WizardType } from 'src/app/core/models/wizard-type.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { EssFileExistsComponent } from 'src/app/shared/components/dialog-components/ess-file-exists/ess-file-exists.component';
import { EvacueeProfileService } from 'src/app/core/services/evacuee-profile.service';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { ComputeRulesService } from 'src/app/core/services/computeRules.service';

@Component({
  selector: 'app-evacuee-search-results',
  templateUrl: './evacuee-search-results.component.html',
  styleUrls: ['./evacuee-search-results.component.scss']
})
export class EvacueeSearchResultsComponent implements OnInit {
  @Output() showDataEntryComponent = new EventEmitter<boolean>();
  registrantResults: Array<RegistrantProfileSearchResultModel>;
  fileResults: Array<EvacuationFileSearchResultModel>;
  evacueeSearchContext: EvacueeSearchContextModel;
  isPaperBased: boolean;
  paperBasedEssFile: string;
  // isLoading = false;
  color = '#169BD5';

  constructor(
    public evacueeSearchResultsService: EvacueeSearchResultsService,
    private evacueeSearchService: EvacueeSearchService,
    private evacueeSessionService: EvacueeSessionService,
    private evacueeProfileService: EvacueeProfileService,
    private userService: UserService,
    private router: Router,
    private alertService: AlertService,
    private dialog: MatDialog,
    private appBaseService: AppBaseService,
    private computeState: ComputeRulesService
  ) {}

  ngOnInit(): void {
    this.searchForEvacuee(
      (this.evacueeSearchContext =
        this.evacueeSearchService.evacueeSearchContext),
      (this.paperBasedEssFile = this.evacueeSessionService.isPaperBased
        ? this.evacueeSearchService.paperBasedEssFile
        : null)
    );
    this.isPaperBased = this.evacueeSessionService.isPaperBased;
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

  /**
   * Resets the search
   */
  searchAgain(): void {
    this.evacueeSearchService.clearEvacueeSearch();
    this.evacueeSessionService.clearEvacueeSession();
    this.showDataEntryComponent.emit(true);
  }

  /**
   * Searches for profiles and ess file based on the
   * search parameters
   *
   * @param evacueeSearchContext search parameters
   */
  searchForEvacuee(
    evacueeSearchContext: EvacueeSearchContextModel,
    paperEssFile?: string
  ): void {
    this.evacueeSearchResultsService.setloadingOverlay(true);
    this.evacueeSearchResultsService
      .searchForEvacuee(
        evacueeSearchContext?.evacueeSearchParameters,
        paperEssFile
      )
      .subscribe({
        next: (results) => {
          this.evacueeSearchResultsService.setloadingOverlay(false);
          this.fileResults = results?.files?.sort(
            (a, b) =>
              new Date(b.modifiedOn).valueOf() -
              new Date(a.modifiedOn).valueOf()
          );
          this.registrantResults = results?.registrants?.sort(
            (a, b) =>
              new Date(b.modifiedOn).valueOf() -
              new Date(a.modifiedOn).valueOf()
          );
        },
        error: (errorEvacuee) => {
          this.evacueeSearchResultsService.setloadingOverlay(false);
          this.alertService.clearAlert();
          this.alertService.setAlert('danger', globalConst.evacueeSearchError);
        }
      });
  }

  openWizard(): void {
    if (this.evacueeSessionService.isPaperBased) {
      this.evacueeProfileService
        .getProfileFiles(undefined, this.paperBasedEssFile)
        .subscribe({
          next: (result) => {
            if (result.length === 0) {
              this.navigateToWizard();
            } else {
              this.openEssFileExistsDialog(
                this.evacueeSearchService.paperBasedEssFile
              );
            }
          },
          error: (errorResponse) => {
            this.alertService.clearAlert();
            this.alertService.setAlert('danger', globalConst.findEssFileError);
          }
        });
    } else {
      this.navigateToWizard();
    }
  }

  private openEssFileExistsDialog(essFile: string): void {
    this.dialog.open(DialogComponent, {
      data: {
        component: EssFileExistsComponent,
        content: { title: 'Paper ESS File Already Exists' },
        essFile
      },
      width: '493px'
    });
  }

  private navigateToWizard(): void {
    this.appBaseService.wizardProperties = {
      wizardType: WizardType.NewRegistration,
      lastCompletedStep: null,
      editFlag: false,
      memberFlag: false
    };
    this.computeState.triggerEvent();

    this.router.navigate(['/ess-wizard'], {
      queryParams: { type: WizardType.NewRegistration },
      queryParamsHandling: 'merge'
    });
  }
}
