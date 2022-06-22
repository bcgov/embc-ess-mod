import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  EvacuationFileHouseholdMember,
  HouseholdMemberType,
  Note,
  RegistrantProfileSearchResult
} from 'src/app/core/api/models';
import { RegistrationsService } from 'src/app/core/api/services';
import {
  HouseholdMemberButtons,
  SelectedPathType
} from 'src/app/core/models/appBase.model';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import {
  ActionPermission,
  ClaimType
} from 'src/app/core/services/authorization.service';
import { CacheService } from 'src/app/core/services/cache.service';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { UserService } from 'src/app/core/services/user.service';

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
    private userService: UserService
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
