import { Injectable } from '@angular/core';
import {
  CommunityType,
  EvacuationFileHouseholdMember,
  EvacuationFileStatus,
  HouseholdMemberType,
  InsuranceOption,
  NeedsAssessmentType,
  RegistrantStatus
} from '../core/api/models';
import { HouseholdMemberService } from '../feature-components/search/essfile-dashboard/household-member/household-member.service';
import { FileDashboardVerifyDialogComponent } from '../shared/components/dialog-components/file-dashboard-verify-dialog/file-dashboard-verify-dialog.component';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import * as globalConst from '../core/services/global-constants';
import { EvacuationFileModel } from '../core/models/evacuation-file.model';
import { MultipleLinkRegistrantModel } from '../core/models/multipleLinkRegistrant.model';
import { RegistrantLinkDialogComponent } from '../shared/components/dialog-components/registrant-link-dialog/registrant-link-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class MockHouseholdMemberService extends HouseholdMemberService {
  viewProfileDialogRef: any;
  multipleLinkingDialogRef: any;
  memberDetails: EvacuationFileHouseholdMember;

  householdMemberValue1 = {
    id: '8aad53b6-7164-4f07-b970-08919289226a',
    linkedRegistrantId: 'ce62a4ec-312d-496d-a519-f1f24c8c5f2c',
    firstName: 'HMTest',
    lastName: 'Context',
    initials: null,
    gender: 'Female',
    dateOfBirth: '11/11/2000',
    type: 'HouseholdMember',
    isPrimaryRegistrant: false,
    isHouseholdMember: true,
    isMinor: false,
    isRestricted: true,
    isVerified: true
  };

  public mockEssfile: EvacuationFileModel = {
    id: '102431',
    manualFileId: null,
    primaryRegistrantId: 'a677e7e1-54ea-48ef-a030-b48c56fccd9c',
    primaryRegistrantFirstName: 'Anne',
    primaryRegistrantLastName: 'Lee',
    evacuatedFromAddress: {
      community: {
        code: '7669dfaf-9f97-ea11-b813-005056830319',
        name: 'Armstrong',
        districtName: 'North Okanagan',
        stateProvinceCode: 'BC',
        countryCode: 'CAN',
        type: CommunityType.City
      },
      addressLine1: '123 Air St',
      addressLine2: '099',
      city: null,
      communityCode: '7669dfaf-9f97-ea11-b813-005056830319',
      stateProvinceCode: null,
      countryCode: null,
      postalCode: 'V0J 2F8',
      country: {
        code: 'CAN',
        name: 'Canada'
      }
    },
    registrationLocation: 'facility',
    needsAssessment: {
      id: '14eda32d-fe43-4c85-ae64-3b41fe737adb',
      createdOn: '2022-02-02T17:38:05Z',
      modifiedOn: '2022-02-02T17:38:05Z',
      reviewingTeamMemberId: '8d955446-de73-ec11-b830-00505683fbf4',
      reviewingTeamMemberDisplayName: 'ESS D.',
      insurance: InsuranceOption.Unsure,
      evacuationImpact: 'evac',
      evacuationExternalReferrals: null,
      petCarePlans: null,
      houseHoldRecoveryPlan: null,
      recommendedReferralServices: [],
      householdMembers: [
        {
          id: '42ab5087-ce1c-48ec-b339-1b1c173842d7',
          linkedRegistrantId: 'a677e7e1-54ea-48ef-a030-b48c56fccd9c',
          firstName: 'Anne',
          lastName: 'Lee',
          initials: null,
          gender: 'Female',
          dateOfBirth: '09/09/1999',
          type: HouseholdMemberType.Registrant,
          isPrimaryRegistrant: true,
          isHouseholdMember: false,
          isMinor: false,
          isRestricted: false,
          isVerified: true
        },
        {
          id: 'c0350e7e-055b-45c9-b32d-1c81c14afdd5',
          linkedRegistrantId: null,
          firstName: 'abcd',
          lastName:
            'erfehrbfjherbfjhrebfjherhbfnceujkrsdhcnqeukasjdcnesjka,dnukasj,dmwehnfurgfyrgfgerhfjdvfdhjvbfdjhbvhd',
          initials: null,
          gender: 'Female',
          dateOfBirth: '09/09/1999',
          type: HouseholdMemberType.HouseholdMember,
          isPrimaryRegistrant: false,
          isHouseholdMember: true,
          isMinor: false,
          isRestricted: null,
          isVerified: null
        }
      ],
      haveSpecialDiet: false,
      specialDietDetails: null,
      takeMedication: false,
      haveMedicalSupplies: false,
      pets: [],
      havePetsFood: false,
      canProvideFood: false,
      canProvideLodging: true,
      canProvideClothing: true,
      canProvideTransportation: false,
      canProvideIncidentals: true,
      type: NeedsAssessmentType.Assessed
    },
    notes: [],
    supports: [],
    securityPhrase: 'l****a',
    securityPhraseEdited: false,
    isRestricted: false,
    status: EvacuationFileStatus.Active,
    evacuationFileDate: '2021-11-23T23:32:16Z',
    householdMembers: [
      {
        id: '42ab5087-ce1c-48ec-b339-1b1c173842d7',
        linkedRegistrantId: 'a677e7e1-54ea-48ef-a030-b48c56fccd9c',
        firstName: 'Anne',
        lastName: 'Lee',
        initials: null,
        gender: 'Female',
        dateOfBirth: '09/09/1999',
        type: HouseholdMemberType.Registrant,
        isPrimaryRegistrant: true,
        isHouseholdMember: false,
        isMinor: false,
        isRestricted: false,
        isVerified: true
      },
      {
        id: 'c0350e7e-055b-45c9-b32d-1c81c14afdd5',
        linkedRegistrantId: null,
        firstName: 'abcd',
        lastName:
          'erfehrbfjherbfjhrebfjherhbfnceujkrsdhcnqeukasjdcnesjka,dnukasj,dmwehnfurgfyrgfgerhfjdvfdhjvbfdjhbvhd',
        initials: null,
        gender: 'Female',
        dateOfBirth: '09/09/1999',
        type: HouseholdMemberType.HouseholdMember,
        isPrimaryRegistrant: false,
        isHouseholdMember: true,
        isMinor: false,
        isRestricted: null,
        isVerified: null
      }
    ],
    task: {
      taskNumber: 'UNIT-TEST-ACTIVE-TASK',
      communityCode: '9e6adfaf-9f97-ea11-b813-005056830319',
      from: '2021-05-12T21:31:00Z',
      to: '2022-09-08T18:53:00Z'
    },
    assignedTaskCommunity: {
      code: '9e6adfaf-9f97-ea11-b813-005056830319',
      name: 'Victoria',
      districtName: 'Capital',
      stateProvinceCode: 'BC',
      countryCode: 'CAN',
      type: CommunityType.City
    }
  };

  singleMatchedProfile = [
    {
      id: 'a7b76c4b-256b-4385-b35e-7b496e70f172',
      isRestricted: false,
      firstName: 'julia',
      lastName: 'roberts',
      status: RegistrantStatus.Verified,
      createdOn: '2022-02-08T21:50:38Z',
      modifiedOn: '2022-02-08T22:50:09Z',
      primaryAddress: {
        community: {
          code: '9069dfaf-9f97-ea11-b813-005056830319',
          name: 'Chetwynd',
          districtName: 'Peace River',
          stateProvinceCode: 'BC',
          countryCode: 'CAN',
          type: CommunityType.DistrictMunicipality
        },
        country: {
          code: 'CAN',
          name: 'Canada'
        },
        addressLine1: '890 Dolphin St',
        addressLine2: null,
        city: null,
        communityCode: '9069dfaf-9f97-ea11-b813-005056830319',
        stateProvinceCode: 'BC',
        countryCode: 'CAN',
        postalCode: null
      },
      evacuationFiles: [
        {
          id: '127510',
          manualFileId: null,
          isPaperBasedFile: false,
          isRestricted: false,
          taskId: null,
          taskStartDate: null,
          taskEndDate: null,
          evacuatedFrom: {
            community: {
              code: '9069dfaf-9f97-ea11-b813-005056830319',
              name: 'Chetwynd',
              districtName: 'Peace River',
              stateProvinceCode: 'BC',
              countryCode: 'CAN',
              type: CommunityType.DistrictMunicipality
            },
            addressLine1: '890 Dolphin St',
            addressLine2: null,
            city: null,
            communityCode: '9069dfaf-9f97-ea11-b813-005056830319',
            stateProvinceCode: null,
            countryCode: null,
            postalCode: null,
            country: {
              code: 'CAN',
              name: 'Canada'
            }
          },
          createdOn: '2022-02-08T21:51:13Z',
          modifiedOn: '2022-02-08T22:56:48Z',
          status: EvacuationFileStatus.Active,
          householdMembers: [
            {
              id: 'acdf1191-75b5-462b-97a8-d4338e236dee',
              firstName: 'julia',
              lastName: 'roberts',
              isSearchMatch: false,
              type: HouseholdMemberType.Registrant,
              isMainApplicant: true,
              isRestricted: false
            }
          ]
        }
      ]
    }
  ];

  multipleMatchedProfile = [
    {
      id: 'a7b76c4b-256b-4385-b35e-7b496e70f172',
      isRestricted: false,
      firstName: 'julia',
      lastName: 'roberts',
      status: RegistrantStatus.Verified,
      createdOn: '2022-02-08T21:50:38Z',
      modifiedOn: '2022-02-08T22:50:09Z',
      primaryAddress: {
        community: {
          code: '9069dfaf-9f97-ea11-b813-005056830319',
          name: 'Chetwynd',
          districtName: 'Peace River',
          stateProvinceCode: 'BC',
          countryCode: 'CAN',
          type: CommunityType.DistrictMunicipality
        },
        country: {
          code: 'CAN',
          name: 'Canada'
        },
        addressLine1: '890 Dolphin St',
        addressLine2: null,
        city: null,
        communityCode: '9069dfaf-9f97-ea11-b813-005056830319',
        stateProvinceCode: 'BC',
        countryCode: 'CAN',
        postalCode: null
      },
      evacuationFiles: [
        {
          id: '127510',
          manualFileId: null,
          isPaperBasedFile: false,
          isRestricted: false,
          taskId: null,
          taskStartDate: null,
          taskEndDate: null,
          evacuatedFrom: {
            community: {
              code: '9069dfaf-9f97-ea11-b813-005056830319',
              name: 'Chetwynd',
              districtName: 'Peace River',
              stateProvinceCode: 'BC',
              countryCode: 'CAN',
              type: CommunityType.DistrictMunicipality
            },
            addressLine1: '890 Dolphin St',
            addressLine2: null,
            city: null,
            communityCode: '9069dfaf-9f97-ea11-b813-005056830319',
            stateProvinceCode: null,
            countryCode: null,
            postalCode: null,
            country: {
              code: 'CAN',
              name: 'Canada'
            }
          },
          createdOn: '2022-02-08T21:51:13Z',
          modifiedOn: '2022-02-08T22:56:48Z',
          status: EvacuationFileStatus.Active,
          householdMembers: [
            {
              id: 'acdf1191-75b5-462b-97a8-d4338e236dee',
              firstName: 'julia',
              lastName: 'roberts',
              isSearchMatch: false,
              type: HouseholdMemberType.Registrant,
              isMainApplicant: true,
              isRestricted: false
            }
          ]
        }
      ]
    },
    {
      id: 'a7b76c4b-256b-4385-b35e-7b496e70f173',
      isRestricted: false,
      firstName: 'julia',
      lastName: 'roberts',
      status: RegistrantStatus.Verified,
      createdOn: '2022-02-08T21:50:38Z',
      modifiedOn: '2022-02-08T22:50:09Z',
      primaryAddress: {
        community: {
          code: '9069dfaf-9f97-ea11-b813-005056830319',
          name: 'Chetwynd',
          districtName: 'Peace River',
          stateProvinceCode: 'BC',
          countryCode: 'CAN',
          type: CommunityType.DistrictMunicipality
        },
        country: {
          code: 'CAN',
          name: 'Canada'
        },
        addressLine1: '890 Dolphin St',
        addressLine2: null,
        city: null,
        communityCode: '9069dfaf-9f97-ea11-b813-005056830319',
        stateProvinceCode: 'BC',
        countryCode: 'CAN',
        postalCode: null
      },
      evacuationFiles: [
        {
          id: '127510',
          manualFileId: null,
          isPaperBasedFile: false,
          isRestricted: false,
          taskId: null,
          taskStartDate: null,
          taskEndDate: null,
          evacuatedFrom: {
            community: {
              code: '9069dfaf-9f97-ea11-b813-005056830319',
              name: 'Chetwynd',
              districtName: 'Peace River',
              stateProvinceCode: 'BC',
              countryCode: 'CAN',
              type: CommunityType.DistrictMunicipality
            },
            addressLine1: '890 Dolphin St',
            addressLine2: null,
            city: null,
            communityCode: '9069dfaf-9f97-ea11-b813-005056830319',
            stateProvinceCode: null,
            countryCode: null,
            postalCode: null,
            country: {
              code: 'CAN',
              name: 'Canada'
            }
          },
          createdOn: '2022-02-08T21:51:13Z',
          modifiedOn: '2022-02-08T22:56:48Z',
          status: EvacuationFileStatus.Active,
          householdMembers: [
            {
              id: 'acdf1191-75b5-462b-97a8-d4338e236dee',
              firstName: 'julia',
              lastName: 'roberts',
              isSearchMatch: false,
              type: HouseholdMemberType.Registrant,
              isMainApplicant: true,
              isRestricted: false
            }
          ]
        }
      ]
    }
  ];

  viewMemberProfile(memberDetails: EvacuationFileHouseholdMember) {
    this.memberDetails = memberDetails;
    this.viewProfileDialogRef = this.dialog.open(DialogComponent, {
      data: {
        component: FileDashboardVerifyDialogComponent,
        content: globalConst.dashboardViewProfile,
        profileData: memberDetails
      },
      width: '720px'
    });

    this.viewProfileDialogRef.afterClosed().subscribe({
      next: (value) => {
        this.createNavigationForRegistrant(value, memberDetails);
      }
    });
  }

  closeYesViewMemberProfileDialog() {
    this.viewProfileDialogRef.close('Yes', this.memberDetails);
  }

  closeNoViewMemberProfileDialog() {
    this.viewProfileDialogRef.close('No', this.memberDetails);
  }

  closeAnsweredViewMemberProfileDialog() {
    this.viewProfileDialogRef.close('answered', this.memberDetails);
  }

  public multipleMatchedRegistrantLink(
    multipleLinkRegistrants: MultipleLinkRegistrantModel,
    essFile: EvacuationFileModel
  ): void {
    this.multipleLinkingDialogRef = this.dialog.open(DialogComponent, {
      data: {
        component: RegistrantLinkDialogComponent,
        profileData: multipleLinkRegistrants
      },
      width: '940px',
      height: '90%'
    });

    this.multipleLinkingDialogRef.afterClosed().subscribe({
      next: (value) => {
        if (value !== 'close') {
          this.navigateForMultipleLink(essFile, multipleLinkRegistrants, value);
        }
      }
    });
  }

  closeMultipleMatchedRegistrantLink() {
    this.multipleLinkingDialogRef.close('a7b76c4b-256b-4385-b35e-7b496e70f173');
  }
}
