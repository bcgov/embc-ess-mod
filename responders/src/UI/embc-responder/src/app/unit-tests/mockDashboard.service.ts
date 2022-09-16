import { Injectable } from '@angular/core';
import {
  CommunityType,
  EvacuationFileStatus,
  HouseholdMemberType,
  InsuranceOption,
  NeedsAssessmentType
} from '../core/api/models';
import { EvacuationFileModel } from '../core/models/evacuation-file.model';
import { RegistrantProfileModel } from '../core/models/registrant-profile.model';
import { ComputeRulesService } from '../core/services/computeRules.service';
import { CustomValidationService } from '../core/services/customValidation.service';
import { EssFileService } from '../core/services/ess-file.service';
import { EvacueeProfileService } from '../core/services/evacuee-profile.service';
import { AppBaseService } from '../core/services/helper/appBase.service';
import { SearchDataService } from '../core/services/helper/search-data.service';
import { MockAlertService } from './mockAlert.service';
import { MockAppBaseService } from './mockAppBase.service';
import { MockEvacueeSearchService } from './mockEvacueeSearch.service';

@Injectable({
  providedIn: 'root'
})
export class MockDashboardService extends SearchDataService {
  public mockProfile: RegistrantProfileModel = {
    id: 'abc',
    createdOn: '2022-02-08T21:50:38Z',
    modifiedOn: '2022-02-08T22:50:09Z',
    restriction: false,
    personalDetails: {
      firstName: 'julia',
      lastName: 'roberts',
      initials: null,
      preferredName: null,
      gender: 'Female',
      dateOfBirth: '12/12/2000'
    },
    contactDetails: {
      email: null,
      phone: '999-999-9999'
    },
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
      stateProvince: {
        code: 'BC',
        name: 'British Columbia',
        countryCode: 'CAN'
      },
      addressLine1: '890 Dolphin St',
      addressLine2: null,
      city: null,
      communityCode: '9069dfaf-9f97-ea11-b813-005056830319',
      stateProvinceCode: 'BC',
      countryCode: 'CAN',
      postalCode: null
    },
    mailingAddress: {
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
      stateProvince: {
        code: 'BC',
        name: 'British Columbia',
        countryCode: 'CAN'
      },
      addressLine1: '890 Dolphin St',
      addressLine2: null,
      city: null,
      communityCode: '9069dfaf-9f97-ea11-b813-005056830319',
      stateProvinceCode: 'BC',
      countryCode: 'CAN',
      postalCode: null
    },
    isMailingAddressSameAsPrimaryAddress: true,
    securityQuestions: [
      {
        id: 1,
        question: 'What was the name of your first pet?',
        answer: 't*****t',
        answerChanged: false
      },
      {
        id: 2,
        question:
          'What was your first car’s make and model? (e.g. Ford Taurus)',
        answer: 't*****t',
        answerChanged: false
      },
      {
        id: 3,
        question: 'Where was your first job?',
        answer: 't*****t',
        answerChanged: false
      }
    ],
    authenticatedUser: false,
    verifiedUser: true
  };

  public mockPaperProfile: RegistrantProfileModel = {
    id: 'bcd',
    createdOn: '2022-02-08T21:50:38Z',
    modifiedOn: '2022-02-08T22:50:09Z',
    restriction: false,
    personalDetails: {
      firstName: 'julia',
      lastName: 'roberts',
      initials: null,
      preferredName: null,
      gender: 'Female',
      dateOfBirth: '12/12/2000'
    },
    contactDetails: {
      email: null,
      phone: '999-999-9999'
    },
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
      stateProvince: {
        code: 'BC',
        name: 'British Columbia',
        countryCode: 'CAN'
      },
      addressLine1: '890 Dolphin St',
      addressLine2: null,
      city: null,
      communityCode: '9069dfaf-9f97-ea11-b813-005056830319',
      stateProvinceCode: 'BC',
      countryCode: 'CAN',
      postalCode: null
    },
    mailingAddress: {
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
      stateProvince: {
        code: 'BC',
        name: 'British Columbia',
        countryCode: 'CAN'
      },
      addressLine1: '890 Dolphin St',
      addressLine2: null,
      city: null,
      communityCode: '9069dfaf-9f97-ea11-b813-005056830319',
      stateProvinceCode: 'BC',
      countryCode: 'CAN',
      postalCode: null
    },
    isMailingAddressSameAsPrimaryAddress: true,
    securityQuestions: [],
    authenticatedUser: false,
    verifiedUser: true
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

  constructor(
    customValidation: CustomValidationService,
    appBaseService: AppBaseService,
    computeState: ComputeRulesService,
    evacueeProfileService: EvacueeProfileService,
    alertService: MockAlertService,
    essFileService: EssFileService,
    evacueeSearchService: MockEvacueeSearchService
  ) {
    super(
      customValidation,
      appBaseService,
      computeState,
      evacueeProfileService,
      alertService,
      essFileService,
      evacueeSearchService
    );
  }

  async getEvacueeProfile(
    evacueeProfileId: string
  ): Promise<RegistrantProfileModel> {
    const profile$ =
      evacueeProfileId === 'abc' ? this.mockProfile : this.mockPaperProfile;
    return profile$;
  }

  async getEssFile(): Promise<EvacuationFileModel> {
    let file$ = null;
    const status = (this.appBaseService as MockAppBaseService)?.fileStatus;
    if (status === EvacuationFileStatus.Active) {
      file$ = this.mockEssfile;
    } else if (status === EvacuationFileStatus.Pending) {
      file$ = { ...this.mockEssfile, status: EvacuationFileStatus.Pending };
    } else if (status === EvacuationFileStatus.Expired) {
      file$ = { ...this.mockEssfile, status: EvacuationFileStatus.Expired };
    } else if (status === EvacuationFileStatus.Completed) {
      file$ = { ...this.mockEssfile, status: EvacuationFileStatus.Completed };
    }
    return file$;
  }
}
