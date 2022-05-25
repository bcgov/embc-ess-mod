import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddressModel } from 'src/app/core/models/address.model';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import { WizardType } from 'src/app/core/models/wizard-type.model';
import { EssFileService } from 'src/app/core/services/ess-file.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { Community } from 'src/app/core/services/locations.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { FileStatusDefinitionComponent } from 'src/app/shared/components/dialog-components/file-status-definition/file-status-definition.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { EssfileDashboardService } from './essfile-dashboard.service';
import * as globalConst from '../../../core/services/global-constants';
import { Note } from 'src/app/core/api/models';
import { StepNotesService } from '../../wizard/step-notes/step-notes.service';
import { map } from 'rxjs/operators';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { DialogContent } from 'src/app/core/models/dialog-content.model';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { ComputeRulesService } from 'src/app/core/services/computeRules.service';
import { EvacueeSearchService } from '../evacuee-search/evacuee-search.service';
import { RegistrantProfileModel } from 'src/app/core/models/registrant-profile.model';
import { EvacueeProfileService } from 'src/app/core/services/evacuee-profile.service';
import { lastValueFrom, tap } from 'rxjs';

@Component({
  selector: 'app-essfile-dashboard',
  templateUrl: './essfile-dashboard.component.html',
  styleUrls: ['./essfile-dashboard.component.scss']
})
export class EssfileDashboardComponent implements OnInit {
  essFile: EvacuationFileModel;
  notesList: Array<Note>;
  isLoading = false;
  color = '#169BD5';
  isMinor = false;
  isLinkedToBcsc = false;
  hasPostal = false;
  eligibilityFirstName: string;
  eligibilityLastName: string;

  constructor(
    private essFileService: EssFileService,
    public evacueeSessionService: EvacueeSessionService,
    private dialog: MatDialog,
    private router: Router,
    private essfileDashboardService: EssfileDashboardService,
    private alertService: AlertService,
    private stepNotesService: StepNotesService,
    public appBaseService: AppBaseService,
    private computeState: ComputeRulesService,
    private evacueeSearchService: EvacueeSearchService,
    private evacueeProfileService: EvacueeProfileService
  ) {}

  async ngOnInit(): Promise<void> {
    this.getEssFile();
    const profile$ = await this.updateMember();

    this.isMinor =
      this.appBaseService?.appModel?.selectedProfile?.selectedEvacueeInContext?.isMinor;
    this.isLinkedToBcsc =
      this.appBaseService?.appModel?.selectedProfile?.selectedEvacueeInContext?.authenticatedUser;
    this.hasPostal = this.hasPostalCode();

    if (this.evacueeSessionService.fileLinkStatus === 'S') {
      this.openLinkDialog(globalConst.profileLinkMessage)
        .afterClosed()
        .subscribe({
          next: (value) => {
            this.evacueeSessionService.fileLinkFlag = null;
            this.evacueeSessionService.fileLinkMetaData = null;
            this.evacueeSessionService.fileLinkStatus = null;
          }
        });
    } else if (this.evacueeSessionService.fileLinkStatus === 'E') {
      this.openLinkDialog(globalConst.profileLinkErrorMessage)
        .afterClosed()
        .subscribe({
          next: (value) => {
            this.evacueeSessionService.fileLinkFlag = null;
            this.evacueeSessionService.fileLinkMetaData = null;
            this.evacueeSessionService.fileLinkStatus = null;
          }
        });
    }

    this.eligiblityDisplayName();
  }

  /**
   * Returns community name
   *
   * @param address evacuated from address
   * @returns community name
   */
  communityName(address: AddressModel): string {
    return (address?.community as Community)?.name;
  }

  /**
   * Open the dialog with definition of
   * profile status
   */
  openStatusDefinition(): void {
    this.dialog.open(DialogComponent, {
      data: {
        component: FileStatusDefinitionComponent,
        content: this.essFile.status
      },
      width: '580px'
    });
  }

  /**
   * Navigates the wizard for review ess file
   */
  reviewEssFile(): void {
    this.isLoading = !this.isLoading;

    this.appBaseService.wizardProperties = {
      wizardType: WizardType.ReviewFile,
      lastCompletedStep: null,
      editFlag: true,
      memberFlag: false
    };
    this.computeState.triggerEvent();

    this.router
      .navigate(['/ess-wizard'], {
        queryParams: { type: WizardType.ReviewFile },
        queryParamsHandling: 'merge'
      })
      .then(() => {
        this.isLoading = !this.isLoading;
      })
      .catch(() => {
        this.isLoading = !this.isLoading;
      });
  }

  /**
   * Loads the default file overview page
   *
   * @param essFile retrieved evacuation file
   */
  loadDefaultOverviewSection(essFile: EvacuationFileModel) {
    this.router.navigate(
      ['/responder-access/search/essfile-dashboard/overview'],
      {
        state: { file: essFile }
      }
    );
  }

  /**
   * Navigates the wizard for complete ess file
   */
  completeEssFile(): void {
    this.isLoading = !this.isLoading;

    this.appBaseService.wizardProperties = {
      wizardType: WizardType.CompleteFile,
      lastCompletedStep: null,
      editFlag: true,
      memberFlag: false
    };
    this.computeState.triggerEvent();

    this.router
      .navigate(['/ess-wizard'], {
        queryParams: { type: WizardType.CompleteFile },
        queryParamsHandling: 'merge'
      })
      .then(() => {
        this.isLoading = !this.isLoading;
      })
      .catch(() => {
        this.isLoading = !this.isLoading;
      });
  }

  /**
   * Loads the ESS file for a give file number
   */
  private getEssFile(): void {
    this.isLoading = !this.isLoading;
    this.essFileService
      .getFileFromId(this.appBaseService?.appModel?.selectedEssFile?.id)
      .pipe(
        map((file: EvacuationFileModel) => {
          this.loadNotes();
          file?.householdMembers.sort(
            (a, b) =>
              Number(b.isPrimaryRegistrant) - Number(a.isPrimaryRegistrant) ||
              new Date(a.dateOfBirth).valueOf() -
                new Date(b.dateOfBirth).valueOf()
          );
          this.essFile = file;
          this.essfileDashboardService.essFile = file;
          return file;
        })
      )
      .subscribe({
        next: (essFile: EvacuationFileModel) => {
          this.loadDefaultOverviewSection(essFile);
          this.isLoading = !this.isLoading;
        },
        error: (error) => {
          this.isLoading = !this.isLoading;
          this.alertService.clearAlert();
          this.alertService.setAlert('danger', globalConst.fileDashboardError);
        }
      });
  }

  private eligiblityDisplayName() {
    if (
      this.appBaseService?.appModel?.selectedProfile
        ?.selectedEvacueeInContext !== null &&
      this.appBaseService?.appModel?.selectedProfile
        ?.selectedEvacueeInContext !== undefined
    ) {
      this.eligibilityFirstName =
        this.appBaseService?.appModel?.selectedProfile?.selectedEvacueeInContext?.personalDetails?.lastName;
      this.eligibilityLastName =
        this.appBaseService?.appModel?.selectedProfile?.selectedEvacueeInContext?.personalDetails?.firstName;
    } else {
      this.eligibilityFirstName =
        this.evacueeSearchService?.evacueeSearchContext?.evacueeSearchParameters?.firstName;
      this.eligibilityLastName =
        this.evacueeSearchService?.evacueeSearchContext?.evacueeSearchParameters?.lastName;
    }
  }

  /**
   * Loads and sorts the notes
   */
  private loadNotes(): void {
    this.stepNotesService.getNotes().subscribe((notes) => {
      const note = notes.sort(
        (a, b) => new Date(b.addedOn).valueOf() - new Date(a.addedOn).valueOf()
      );
      this.notesList = note;
    });
  }

  /**
   * Opens link success dialog box
   *
   * @returns mat dialog reference
   */
  private openLinkDialog(displayMessage: DialogContent) {
    return this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        content: displayMessage
      },
      width: '530px'
    });
  }

  private async updateMember() {
    if (
      this.appBaseService?.appModel?.selectedProfile
        ?.householdMemberRegistrantId !== undefined
    ) {
      if (this.appBaseService?.appModel?.selectedProfile.profileReloadFlag) {
        const profile$ = await this.getEvacueeProfile(
          this.appBaseService?.appModel?.selectedProfile
            ?.selectedEvacueeInContext?.id
        );
      }
      this.appBaseService.appModel = {
        selectedProfile: {
          selectedEvacueeInContext:
            this.appBaseService?.appModel?.selectedProfile
              ?.selectedEvacueeInContext,
          householdMemberRegistrantId: undefined,
          profileReloadFlag: null
        }
      };
      this.computeState.triggerEvent();
    }
  }

  private getEvacueeProfile(
    evacueeProfileId: string
  ): Promise<RegistrantProfileModel> {
    const profile$ = this.evacueeProfileService
      .getProfileFromId(evacueeProfileId)
      .pipe(
        tap({
          next: (profile: RegistrantProfileModel) => {},
          error: (error) => {
            this.alertService.clearAlert();
            this.alertService.setAlert('danger', globalConst.getProfileError);
          }
        })
      );
    return lastValueFrom(profile$);
  }

  private hasPostalCode(): boolean {
    return (
      this.appBaseService?.appModel?.selectedProfile?.selectedEvacueeInContext
        ?.primaryAddress.postalCode !== null &&
      this.appBaseService?.appModel?.selectedProfile?.selectedEvacueeInContext
        ?.primaryAddress.postalCode !== '' &&
      this.appBaseService?.appModel?.selectedProfile?.selectedEvacueeInContext
        ?.primaryAddress.postalCode !== undefined
    );
  }
}
