import { Injectable } from '@angular/core';
import {
  CommunityType,
  EvacuationFileStatus,
  HouseholdMemberType,
  InsuranceOption,
  NeedsAssessmentType,
  SupportCategory,
  SupportMethod,
  SupportStatus,
  SupportSubCategory
} from '../core/api/models';
import { EvacuationFileModel } from '../core/models/evacuation-file.model';
import { TabModel } from '../core/models/tab.model';
import { StepEssFileService } from '../feature-components/wizard/step-ess-file/step-ess-file.service';

@Injectable({
  providedIn: 'root'
})
export class MockStepEssFileService extends StepEssFileService {
  public essTabsValue: Array<TabModel>;
  public essFileValue: EvacuationFileModel;

  public get selectedEssFile(): EvacuationFileModel {
    return this.essFileValue;
  }

  public set selectedEssFile(essFile: EvacuationFileModel) {
    this.essFileValue = essFile;
  }

  public get essTabs(): Array<TabModel> {
    return this.essTabsValue;
  }
  public set essTabs(essTabsValue: Array<TabModel>) {
    this.essTabsValue = essTabsValue;
  }

  public essFileTabs: Array<TabModel> = [
    {
      label: 'Evacuation Details',
      route: 'evacuation-details',
      name: 'evacuation-details',
      status: 'not-started',
      next: '/ess-wizard/ess-file/household-members'
    },
    {
      label: 'Household Members',
      route: 'household-members',
      name: 'household-members',
      status: 'not-started',
      next: '/ess-wizard/ess-file/animals',
      previous: '/ess-wizard/ess-file/evacuation-details'
    },
    {
      label: 'Animals',
      route: 'animals',
      name: 'animals',
      status: 'not-started',
      next: '/ess-wizard/ess-file/needs',
      previous: '/ess-wizard/ess-file/household-members'
    },
    {
      label: 'Needs',
      route: 'needs',
      name: 'needs',
      status: 'not-started',
      next: '/ess-wizard/ess-file/security-phrase',
      previous: '/ess-wizard/ess-file/animals'
    },
    {
      label: 'Security Phrase',
      route: 'security-phrase',
      name: 'security-phrase',
      status: 'not-started',
      next: '/ess-wizard/ess-file/review',
      previous: '/ess-wizard/ess-file/needs'
    },
    {
      label: 'Review & Save',
      route: 'review',
      name: 'review',
      status: 'not-started',
      previous: '/ess-wizard/ess-file/security-phrase'
    }
  ];

  public paperEssFileTabs: Array<TabModel> = [
    {
      label: 'Evacuation Details',
      route: 'evacuation-details',
      name: 'evacuation-details',
      status: 'not-started',
      next: '/ess-wizard/ess-file/household-members'
    },
    {
      label: 'Household Members',
      route: 'household-members',
      name: 'household-members',
      status: 'not-started',
      next: '/ess-wizard/ess-file/animals',
      previous: '/ess-wizard/ess-file/evacuation-details'
    },
    {
      label: 'Animals',
      route: 'animals',
      name: 'animals',
      status: 'not-started',
      next: '/ess-wizard/ess-file/needs',
      previous: '/ess-wizard/ess-file/household-members'
    },
    {
      label: 'Needs',
      route: 'needs',
      name: 'needs',
      status: 'not-started',
      next: '/ess-wizard/ess-file/review',
      previous: '/ess-wizard/ess-file/animals'
    },
    {
      label: 'Review & Save',
      route: 'review',
      name: 'review',
      status: 'not-started',
      previous: '/ess-wizard/ess-file/needs'
    }
  ];

  public essFile: EvacuationFileModel = {
    id: '154150',
    manualFileId: null,
    completedOn: null,
    completedBy: null,
    isPaper: false,
    primaryRegistrantId: 'a7b76c4b-256b-4385-b35e-7b496e70f172',
    primaryRegistrantFirstName: 'julia',
    primaryRegistrantLastName: 'roberts',
    evacuatedFromAddress: {
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
      country: { name: 'Canada', code: 'CAN' }
    },
    registrationLocation: 'location',
    needsAssessment: {
      id: '36e9fedc-ffcf-4aa9-a177-10f211ecfc33',
      createdOn: '2022-03-28T23:52:31Z',
      modifiedOn: '2022-03-28T23:52:31Z',
      reviewingTeamMemberId: '49475fd6-df73-ec11-b830-00505683fbf4',
      reviewingTeamMemberDisplayName: 'Sue T.',
      insurance: InsuranceOption.Unsure,
      evacuationImpact: 'evac',
      evacuationExternalReferrals: null,
      petCarePlans: null,
      houseHoldRecoveryPlan: null,
      recommendedReferralServices: [],
      householdMembers: [
        {
          id: '76d303d5-7466-47ad-9df8-0c117fa56980',
          linkedRegistrantId: 'a7b76c4b-256b-4385-b35e-7b496e70f172',
          firstName: 'julia',
          lastName: 'roberts',
          initials: null,
          gender: 'Female',
          dateOfBirth: '12/12/2000',
          type: HouseholdMemberType.Registrant,
          isPrimaryRegistrant: true,
          isHouseholdMember: false,
          isMinor: false,
          isRestricted: false,
          isVerified: true
        }
      ],
      haveSpecialDiet: false,
      specialDietDetails: null,
      takeMedication: false,
      haveMedicalSupplies: false,
      pets: [],
      havePetsFood: false,
      canProvideFood: true,
      canProvideLodging: true,
      canProvideClothing: true,
      canProvideTransportation: true,
      canProvideIncidentals: true,
      type: NeedsAssessmentType.Assessed
    },
    notes: [],
    supports: [
      {
        category: SupportCategory.Food,
        subCategory: SupportSubCategory.Food_Groceries,
        id: 'D2035834',
        fileId: '154150',
        createdOn: '2022-03-28T23:53:59Z',
        createdBy: 'Sue, T',
        createdByTeam: 'DEV Team',
        issuedOn: '2022-03-28T23:53:58Z',
        issuedBy: 'Sue, T',
        issuedByTeam: 'DEV Team',
        needsAssessmentId: '36e9fedc-ffcf-4aa9-a177-10f211ecfc33',
        from: '2022-03-28T23:53:00Z',
        to: '2022-03-29T23:54:00Z',
        status: SupportStatus.Active,
        method: SupportMethod.Referral,
        supportDelivery: {
          method: SupportMethod.Referral
        },
        includedHouseholdMembers: ['76d303d5-7466-47ad-9df8-0c117fa56980']
      }
    ],
    securityPhrase: 's****e',
    securityPhraseEdited: false,
    isRestricted: false,
    status: EvacuationFileStatus.Active,
    evacuationFileDate: '2022-03-28T23:52:28Z',
    householdMembers: [
      {
        id: '76d303d5-7466-47ad-9df8-0c117fa56980',
        linkedRegistrantId: 'a7b76c4b-256b-4385-b35e-7b496e70f172',
        firstName: 'julia',
        lastName: 'roberts',
        initials: null,
        gender: 'Female',
        dateOfBirth: '12/12/2000',
        type: HouseholdMemberType.Registrant,
        isPrimaryRegistrant: true,
        isHouseholdMember: false,
        isMinor: false,
        isRestricted: false,
        isVerified: true
      }
    ],
    task: {
      taskNumber: 'test',
      communityCode: '7269dfaf-9f97-ea11-b813-005056830319',
      from: '2021-03-23T17:26:00Z',
      to: '2022-04-14T15:00:00Z',
      status: 'Active',
      features: [
        {
          name: 'digital-support-referrals',
          enabled: true
        },
        {
          name: 'digital-support-etransfer',
          enabled: true
        },
        {
          name: 'paper-support-referrals',
          enabled: false
        }
      ]
    },
    assignedTaskCommunity: {
      code: '7269dfaf-9f97-ea11-b813-005056830319',
      name: 'Alert Bay',
      districtName: 'Mount Waddington',
      stateProvinceCode: 'BC',
      countryCode: 'CAN',
      type: CommunityType.Village
    }
  };
}
