/* eslint-disable prettier/prettier */
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { EvacuationFileHouseholdMember } from 'src/app/core/api/models/evacuation-file-household-member';
import { EvacuationFileSearchResultModel } from 'src/app/core/models/evacuation-file-search-result.model';
import { RegistrantProfileModel } from 'src/app/core/models/registrant-profile.model';
import { EssFileService } from 'src/app/core/services/ess-file.service';
import { EvacueeProfileService } from 'src/app/core/services/evacuee-profile.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import * as globalConst from '../../../../core/services/global-constants';

@Component({
  selector: 'app-possible-matched-essfiles',
  templateUrl: './possible-matched-essfiles.component.html',
  styleUrls: ['./possible-matched-essfiles.component.scss']
})
export class PossibleMatchedEssfilesComponent implements OnInit, OnChanges {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @Input() evacueeProfile: RegistrantProfileModel;
  currentlyOpenedItemIndex = -1;
  essFiles: Array<EvacuationFileSearchResultModel>;
  isLoading = false;
  public color = '#169BD5';

  constructor(
    private evacueeSessionService: EvacueeSessionService,
    private evacueeProfileService: EvacueeProfileService,
    private essFileService: EssFileService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    
    if (changes.evacueeProfile) {
      if (this.evacueeProfile !== undefined) {
        this.getEssfilesMatches(
          this.evacueeProfile?.personalDetails?.firstName,
          this.evacueeProfile?.personalDetails?.lastName,
          this.evacueeProfile?.personalDetails?.dateOfBirth
        );
      }
    }
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

  linkToESSFile(fileId: string) {
    this.essFileService.getFileFromId(fileId).subscribe((essFile) => {
      console.log(essFile);

      const householdMemberId = this.getRegistrantIdToLink(essFile.householdMembers);
      this.evacueeSessionService.essFileNumber = essFile.id;
      this.evacueeSessionService.fileLinkFlag = 'Y';
      this.evacueeSessionService.securityPhraseOpenedFrom =
      'responder-access/search/evacuee-profile-dashboard';
      this.evacueeSessionService.fileLinkMetaData = {
      fileId,
      linkRequest: {
        householdMemberId,
        registantId: this.evacueeProfile.id
      }
    };
    this.router.navigate(['responder-access/search/security-phrase']);
    });
    
  }

  /**
   * Gets possible ess files where the current evacuee is a household member
   *
   * @param firstName first name of the current evacuee's profile
   * @param lastName last name of the current evacuee's profile
   * @param dateOfBirth date of birth of the current evacuee's profile
   */
  private getEssfilesMatches(
    firstName: string,
    lastName: string,
    dateOfBirth: string
  ): void {
    this.isLoading = !this.isLoading;
    this.evacueeProfileService
      .getFileMatches(firstName, lastName, dateOfBirth)
      .subscribe(
        (essFileArray) => {
          this.essFiles = essFileArray;
          this.isLoading = !this.isLoading;
        },
        (error) => {
          this.isLoading = !this.isLoading;
          this.alertService.clearAlert();
          this.alertService.setAlert(
            'danger',
            globalConst.getPossibleEssfileMatchError
          );
        }
      );
  }

  private getRegistrantIdToLink(householdMembers: Array<EvacuationFileHouseholdMember>): string {
    
    for (const member of householdMembers) {
      if (member.firstName === this.evacueeProfile.personalDetails.firstName && 
        member.lastName === this.evacueeProfile.personalDetails.lastName &&
        member.dateOfBirth === this.evacueeProfile.personalDetails.dateOfBirth) {
          return member.id;
        }
    }
    return null;
  }
}
