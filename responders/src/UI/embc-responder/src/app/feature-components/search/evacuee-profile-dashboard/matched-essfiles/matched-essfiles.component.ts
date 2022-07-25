import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { EvacuationFileStatus, MemberRole } from 'src/app/core/api/models';
import { EvacuationFileSummaryModel } from 'src/app/core/models/evacuation-file-summary.model';
import { ComputeRulesService } from 'src/app/core/services/computeRules.service';
import { EvacueeProfileService } from 'src/app/core/services/evacuee-profile.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { UserService } from 'src/app/core/services/user.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { FileStatusDefinitionComponent } from 'src/app/shared/components/dialog-components/file-status-definition/file-status-definition.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import * as globalConst from '../../../../core/services/global-constants';
import { EvacueeSearchService } from '../../evacuee-search/evacuee-search.service';

@Component({
  selector: 'app-matched-essfiles',
  templateUrl: './matched-essfiles.component.html',
  styleUrls: ['./matched-essfiles.component.scss']
})
export class MatchedEssfilesComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  currentlyOpenedItemIndex = -1;
  essFiles: Array<EvacuationFileSummaryModel> = [];
  isPaperBased: boolean;
  paperBasedEssFile: string;
  registrantId: string;
  isLoading = false;
  public color = '#169BD5';

  constructor(
    private dialog: MatDialog,
    private evacueeSessionService: EvacueeSessionService,
    private evacueeSearchService: EvacueeSearchService,
    private evacueeProfileService: EvacueeProfileService,
    private alertService: AlertService,
    private router: Router,
    private userService: UserService,
    private appBaseService: AppBaseService,
    private computeState: ComputeRulesService
  ) {}

  ngOnInit(): void {
    this.isPaperBased = this.evacueeSessionService.isPaperBased;
    this.paperBasedEssFile =
      this.evacueeSearchService?.evacueeSearchContext?.evacueeSearchParameters?.paperFileNumber;
    this.registrantId =
      this.appBaseService?.appModel?.selectedProfile?.selectedEvacueeInContext?.id;
    this.getProfileESSFiles(this.registrantId);
  }

  /**
   * Sets expanded input value for panel
   *
   * @param index
   * @returns
   */
  isExpanded(index: number): boolean {
    return index === 0;
  }

  /**
   * Updates value of openend file index
   *
   * @param itemIndex selected file index
   */
  setOpened(itemIndex: number): void {
    this.currentlyOpenedItemIndex = itemIndex;
  }

  /**
   * Resets the opened file index to default
   *
   * @param itemIndex closed file index
   */
  setClosed(itemIndex: number): void {
    if (this.currentlyOpenedItemIndex === itemIndex) {
      this.currentlyOpenedItemIndex = -1;
    }
  }

  /**
   * Open the dialog with definition of
   * profile status
   */
  openStatusDefinition(): void {
    this.dialog.open(DialogComponent, {
      data: {
        component: FileStatusDefinitionComponent,
        content: 'All'
      },
      width: '500px'
    });
  }

  /**
   * Redirects to the ESSFile dashboard to display details of the selected file
   *
   * @param essFileId the essFileID of the selected item
   */
  goToESSFile(essFileId: string): void {
    this.setSelectedFile(essFileId);
    this.router.navigate(['/responder-access/search/essfile-dashboard']);
  }

  /**
   * Checks whether the button "Proceed to ESS File should be displayed or not"
   *
   * @param externalEssFile the externalEssFile number for the selected file
   */
  isDisplayedProceedESSFile(externalEssFile: string): boolean {
    if (this.isPaperBased) {
      if (this.paperBasedEssFile === externalEssFile) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  /**
   * Gets all the matched ESSFile list related to the selected profile Dashboard to be diplayed on the ESSFiles section.
   *
   * @param registrantId the selected registrandID
   */
  private getProfileESSFiles(registrantId: string): void {
    this.isLoading = !this.isLoading;
    this.evacueeProfileService.getProfileFiles(registrantId).subscribe({
      next: (essFilesArray: Array<EvacuationFileSummaryModel>) => {
        const loggedInRole = this.userService?.currentProfile?.role;
        if (essFilesArray !== undefined || essFilesArray.length !== 0) {
          if (this.evacueeSessionService.isPaperBased) {
            if (loggedInRole !== MemberRole.Tier1) {
              this.essFiles = essFilesArray;
            } else if (
              loggedInRole === MemberRole.Tier1 &&
              this.evacueeSearchService?.evacueeSearchContext
                ?.evacueeSearchParameters?.paperFileNumber
            ) {
              this.essFiles = essFilesArray.filter(
                (files) =>
                  files.manualFileId ===
                  this.evacueeSearchService?.evacueeSearchContext
                    ?.evacueeSearchParameters?.paperFileNumber
              );
            }
          } else {
            if (loggedInRole === MemberRole.Tier1) {
              this.essFiles = essFilesArray.filter(
                (files) => files.status !== EvacuationFileStatus.Completed
              );
            } else {
              this.essFiles = essFilesArray;
            }
          }
        } else {
          this.essFiles = [];
        }

        this.isLoading = !this.isLoading;
      },
      error: (error) => {
        this.isLoading = !this.isLoading;
        this.alertService.clearAlert();
        this.alertService.setAlert(
          'danger',
          globalConst.getProfileEssFilesError
        );
      }
    });
  }

  private setSelectedFile(fileId: string) {
    this.appBaseService.appModel.selectedEssFile = {
      id: fileId,
      evacuatedFromAddress: null,
      needsAssessment: null,
      primaryRegistrantId: null,
      registrationLocation: null,
      task: null
    };

    this.computeState.triggerEvent();
  }
}
