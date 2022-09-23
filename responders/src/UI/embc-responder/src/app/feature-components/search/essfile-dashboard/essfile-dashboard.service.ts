import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {
  EvacuationFileHouseholdMember,
  EvacuationFileStatus,
  HouseholdMemberType,
  Note,
  RegistrantProfileSearchResult
} from 'src/app/core/api/models';
import { RegistrationsService } from 'src/app/core/api/services';
import { OptionInjectionService } from 'src/app/core/interfaces/searchOptions.service';
import {
  HouseholdMemberButtons,
  SelectedPathType
} from 'src/app/core/models/appBase.model';
import { DialogContent } from 'src/app/core/models/dialog-content.model';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import { WizardType } from 'src/app/core/models/wizard-type.model';
import {
  ActionPermission,
  ClaimType
} from 'src/app/core/services/authorization.service';
import { CacheService } from 'src/app/core/services/cache.service';
import { ComputeRulesService } from 'src/app/core/services/computeRules.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { UserService } from 'src/app/core/services/user.service';
import { FileStatusDefinitionComponent } from 'src/app/shared/components/dialog-components/file-status-definition/file-status-definition.component';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import * as globalConst from '../../../core/services/global-constants';
import { EvacueeSearchService } from '../evacuee-search/evacuee-search.service';

@Injectable({
  providedIn: 'root'
})
export class EssfileDashboardService {
  private essFileVal: EvacuationFileModel;
  private selectedMemberVal: EvacuationFileHouseholdMember;
  private matchedProfileCountVal: number;
  private matchedProfilesVal: RegistrantProfileSearchResult[];
  private displayMemberButtonVal: HouseholdMemberButtons;

  constructor(
    private cacheService: CacheService,
    private registrationService: RegistrationsService,
    private appBaseService: AppBaseService,
    private userService: UserService,
    private dialog: MatDialog,
    public evacueeSessionService: EvacueeSessionService,
    private computeState: ComputeRulesService,
    private optionInjectionService: OptionInjectionService,
    private evacueeSearchService: EvacueeSearchService
  ) {}

  get essFile(): EvacuationFileModel {
    return this.essFileVal === null || this.essFileVal === undefined
      ? JSON.parse(this.cacheService.get('essFile'))
      : this.essFileVal;
  }

  set essFile(essFileVal: EvacuationFileModel) {
    this.essFileVal = essFileVal;
    this.cacheService.set('essFile', essFileVal);
  }

  public get selectedMember(): EvacuationFileHouseholdMember {
    return this.selectedMemberVal;
  }
  public set selectedMember(value: EvacuationFileHouseholdMember) {
    this.selectedMemberVal = value;
  }

  public get matchedProfileCount(): number {
    return this.matchedProfileCountVal;
  }
  public set matchedProfileCount(value: number) {
    this.matchedProfileCountVal = value;
  }

  public get matchedProfiles(): RegistrantProfileSearchResult[] {
    return this.matchedProfilesVal;
  }
  public set matchedProfiles(value: RegistrantProfileSearchResult[]) {
    this.matchedProfilesVal = value;
  }

  public get displayMemberButton(): HouseholdMemberButtons {
    return this.displayMemberButtonVal;
  }
  public set displayMemberButton(value: HouseholdMemberButtons) {
    this.displayMemberButtonVal = value;
  }

  public getPossibleProfileMatches(
    firstName: string,
    lastName: string,
    dateOfBirth: string
  ): Observable<RegistrantProfileSearchResult[]> {
    return this.registrationService.registrationsSearchMatchingRegistrants({
      firstName,
      lastName,
      dateOfBirth
    });
  }

  public maphouseholdMemberDisplayButton(): void {
    if (this.selectedMember?.type === HouseholdMemberType.HouseholdMember) {
      if (
        this.selectedMember.linkedRegistrantId !== null &&
        this.appBaseService?.appModel?.selectedUserPathway ===
          SelectedPathType.digital
      ) {
        this.displayMemberButton = HouseholdMemberButtons.viewProfile;
      } else if (this.matchedProfiles?.length === 0) {
        // Member has 0 profile match found
        this.displayMemberButton = HouseholdMemberButtons.createProfile;

        // Member has 1 match and has security questions OR Member has more than 1 match
      } else if (
        (this.matchedProfiles?.length === 1 &&
          this.matchedProfiles[0]?.isProfileCompleted) ||
        this.matchedProfiles?.length > 1
      ) {
        this.displayMemberButton = HouseholdMemberButtons.linkProfile;

        // Member has 1 match and doesn't have security questions
      } else if (
        this.matchedProfiles?.length === 1 &&
        !this.matchedProfiles[0]?.isProfileCompleted
      ) {
        this.displayMemberButton = HouseholdMemberButtons.cannotLinkProfile;
      }
    } else {
      if (
        this.appBaseService?.appModel?.selectedUserPathway ===
          SelectedPathType.digital ||
        (this.appBaseService?.appModel?.selectedUserPathway ===
          SelectedPathType.paperBased &&
          this.appBaseService?.appModel.selectedProfile.selectedEvacueeInContext
            .id ===
            this.appBaseService?.appModel.selectedEssFile.primaryRegistrantId)
      ) {
        this.displayMemberButton = HouseholdMemberButtons.viewProfile;
      }
    }
  }

  public getWizardType(
    optionType: string,
    essFile: EvacuationFileModel
  ): string {
    if (
      essFile?.status === EvacuationFileStatus.Pending ||
      essFile?.status === EvacuationFileStatus.Expired
    ) {
      return WizardType.CompleteFile;
    } else if (
      essFile?.status === EvacuationFileStatus.Active &&
      optionType === SelectedPathType.remoteExtensions
    ) {
      return WizardType.ExtendSupports;
    } else if (optionType === SelectedPathType.caseNotes) {
      return WizardType.CaseNotes;
    } else {
      return WizardType.ReviewFile;
    }
  }

  public loadNotes(notes: Note[]): Note[] {
    let validNotes: Note[] = [];
    if (this.hasPermission('canSeeHiddenNotes')) {
      validNotes = notes;
    } else {
      validNotes = notes.filter((note) => !note.isHidden);
    }

    return validNotes.sort(
      (a, b) => new Date(b.addedOn).valueOf() - new Date(a.addedOn).valueOf()
    );
  }

  /**
   * Open the dialog with definition of
   * profile status
   */
  openStatusDefinition(): void {
    this.dialog.open(DialogComponent, {
      data: {
        component: FileStatusDefinitionComponent,
        content: this.essFile?.status
      },
      width: '580px'
    });
  }

  /**
   * Opens link success dialog box
   *
   * @returns mat dialog reference
   */
  public openLinkDialog(displayMessage: DialogContent) {
    return this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        content: displayMessage
      },
      width: '530px'
    });
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

  public hasPostalCode(): boolean {
    return (
      this.appBaseService?.appModel?.selectedProfile?.selectedEvacueeInContext
        ?.primaryAddress.postalCode !== null &&
      this.appBaseService?.appModel?.selectedProfile?.selectedEvacueeInContext
        ?.primaryAddress.postalCode !== '' &&
      this.appBaseService?.appModel?.selectedProfile?.selectedEvacueeInContext
        ?.primaryAddress.postalCode !== undefined &&
      this.appBaseService?.appModel?.selectedProfile?.selectedEvacueeInContext
        ?.primaryAddress?.stateProvince?.code === 'BC'
    );
  }

  public showFileLinkingPopups() {
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
  }

  public async updateMember() {
    if (
      this.appBaseService?.appModel?.selectedProfile
        ?.householdMemberRegistrantId !== undefined
    ) {
      if (this.appBaseService?.appModel?.selectedProfile.profileReloadFlag) {
        const profile$ =
          await this.optionInjectionService.instance.loadEvcaueeProfile(
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

  public eligibilityFirstName(): string {
    if (
      this.appBaseService?.appModel?.selectedProfile
        ?.selectedEvacueeInContext !== null &&
      this.appBaseService?.appModel?.selectedProfile
        ?.selectedEvacueeInContext !== undefined
    ) {
      return this.appBaseService?.appModel?.selectedProfile
        ?.selectedEvacueeInContext?.personalDetails?.firstName;
    } else {
      return this.evacueeSearchService?.evacueeSearchContext
        ?.evacueeSearchParameters?.firstName;
    }
  }

  public eligibilityLastName(): string {
    if (
      this.appBaseService?.appModel?.selectedProfile
        ?.selectedEvacueeInContext !== null &&
      this.appBaseService?.appModel?.selectedProfile
        ?.selectedEvacueeInContext !== undefined
    ) {
      return this.appBaseService?.appModel?.selectedProfile
        ?.selectedEvacueeInContext?.personalDetails?.lastName;
    } else {
      return this.evacueeSearchService?.evacueeSearchContext
        ?.evacueeSearchParameters?.lastName;
    }
  }
}
